import {
	Alert,
	Badge,
	Card,
	Carousel,
	Col,
	Container,
	Image,
	Row,
	Spinner,
	Stack,
} from "react-bootstrap";
import { useParams } from "react-router";
import useGetPlace from "../hooks/useGetPlace";
import { firebaseTimestampToString } from "../helpers/time";
import DropZone from "../components/DropZone";
import useAuth from "../hooks/useAuth";
import useStreamPlaceImages from "../hooks/useStreamPlaceImages";
import noImgPiqture from "../assets/images/No_Image_Available.jpg"



const PlacePage = () => {
	const { currentUser } = useAuth();


	const { id } = useParams<{ id: string }>();
	const { data: place, isLoading, error } = useGetPlace(id);
	const { data: images, isLoading: isLoadingIMGs } = useStreamPlaceImages(id);
	console.log(images);

	if (isLoading) {
		return (
			<Container className="py-4">
				<Card className="shadow-sm rounded-3">
					<Card.Body className="d-flex align-items-center gap-2">
						<Spinner animation="border" size="sm" />
						<span>Loading place…</span>
					</Card.Body>
				</Card>
			</Container>
		);
	}

	if (error) {
		return (
			<Container className="py-4">
				<Alert variant="danger">Failed to load place: {String(error)}</Alert>
			</Container>
		);
	}

	if (!place || !id) {
		return (
			<Container className="py-4">
				<Alert variant="warning">Place not found.</Alert>
			</Container>
		);
	}

	// Normalize offers: accept string or string[]
	const offers: string[] = Array.isArray(place.offers)
		? place.offers
		: place.offers
			? [place.offers]
			: [];

	console.log("images:", images);


	return (
		<Container className="py-4">
			<Row className="g-4 justify-content-center">
				<Col>
					<Card className="shadow rounded-3 border-0">
						<Card.Body className="px-3 py-2">
							<Row>

								<Col lg={6}>
									<Card className="mt-3 shadow rounded-3 border-0">
										<Card.Body>
											{/* Header: name + category + suggestion status */}
											<div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
												<div>
													<Card.Title className="mb-1">{place.name}</Card.Title>
													<div className="text-muted">
														{place.address}, {place.city}
													</div>
												</div>
												<div className="d-flex gap-2">
													<Badge bg="secondary">{place.category}</Badge>
													{place.isSuggestion && (
														<Badge bg="warning" text="dark">
															Suggestion
														</Badge>
													)}
												</div>
											</div>

											{place.description && (
												<Card.Text className="mt-3">{place.description}</Card.Text>
											)}

											{/* Offers */}
											{offers.length > 0 && (
												<div className="mt-3">
													<div className="fw-semibold mb-1">Offers</div>
													<Stack direction="horizontal" gap={2} className="flex-wrap">
														{offers.map((o) => (
															<Badge key={o} bg="secondary" className="mb-1">
																{o}
															</Badge>
														))}
													</Stack>
												</div>
											)}

											{/* Contact */}
											<div className="mt-4">
												<div className="fw-semibold mb-1">Contact</div>
												<Stack gap={1}>
													{place.phone && (
														<div>
															<span className="text-muted">Phone:</span> {place.phone}
														</div>
													)}
													{place.email && (
														<div>
															<span className="text-muted">Email:</span> {place.email}
														</div>
													)}
													{place.website && (
														<div>
															<span className="text-muted">Website:</span>{" "}
															{place.website}
														</div>
													)}
													{place.facebook && (
														<div>
															<span className="text-muted">Facebook:</span>{" "}
															{place.facebook}
														</div>
													)}
													{place.instagram && (
														<div>
															<span className="text-muted">Instagram:</span>{" "}
															{place.instagram}
														</div>
													)}
													{!place.phone &&
														!place.email &&
														!place.website &&
														!place.facebook &&
														!place.instagram && (
															<div className="text-muted">
																No contact information provided.
															</div>
														)}
												</Stack>
											</div>



										</Card.Body>
									</Card>
								</Col>


								<Col lg={6}>
									<Card className="border-0">
										<Card.Body>
											<Card.Title className="text-center">
												Pictures
											</Card.Title>
											<hr />
											{images && images.length > 0 
											? <Carousel>
												{images?.map((img) => (
													<Carousel.Item key={img._id}>
														<div className="carousel">
															<img key={img._id} src={img.url} alt={`piqture on ${img.name}`} className="carouselImg" />
														</div>
													</Carousel.Item>
												))}
											</Carousel> 
											: <div className="d-flex justify-content-center">
												<Image alt="No Image Available" src={noImgPiqture} className="noImgAvailable"></Image>
											</div> 
											}
											
										</Card.Body>
									</Card>
								</Col>
								{currentUser && <DropZone user={currentUser} placeId={id} />}
								<div className="mt-1 small text-muted">
									{place.updatedAt && <>Last Updated: {firebaseTimestampToString(place.updatedAt)}</>}
								</div>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default PlacePage;
