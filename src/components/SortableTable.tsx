import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
} from "@tanstack/react-table";
import BSTable from "react-bootstrap/Table";
import { useState } from "react";
import { Link } from "react-router";

interface SortableTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	getRowLink?: (row: TData) => string;
}

const sortingIndicators = {
	asc: "▲",
	desc: "▼",
};

const SortableTable = <TData, TValue>({
	columns,
	data,
	getRowLink,
}: SortableTableProps<TData, TValue>) => {
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<BSTable hover responsive striped size="sm" className="mytable">
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							const sortDirection = header.column.getIsSorted();

							return (
								<th key={header.id} colSpan={header.colSpan}>
									{header.isPlaceholder ? null : (
										<div
											className={header.column.getCanSort() ? "sortable" : ""}
											onClick={header.column.getToggleSortingHandler()}
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}

											{sortDirection && sortingIndicators[sortDirection]}
										</div>
									)}
								</th>
							);
						})}
					</tr>
				))}
			</thead>

			<tbody>
				{table.getRowModel().rows.map((row) => {
					const href = getRowLink?.(row.original);
					return (
						<tr key={row.id} style={{ cursor: href ? "pointer" : "auto" }}>
							{row.getVisibleCells().map((cell, index) => (
								<td key={cell.id} className="position-relative">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
									{href && index === 0 && (
										<Link
											to={href}
											className="stretched-link"
											aria-label="Open details"
										/>
									)}
								</td>
							))}
						</tr>
					);
				})}
			</tbody>
		</BSTable>
	);
};

export default SortableTable;
