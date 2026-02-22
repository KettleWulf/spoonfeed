import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
} from "@tanstack/react-table";
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
		<div className="overflow-x-auto rounded-md">
			<table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-md text-sm">
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const sortDirection = header.column.getIsSorted();

								return (
									<th
										key={header.id}
										colSpan={header.colSpan}
										className="bg-[#2e7d32] px-4 py-3 text-left font-semibold text-white"
									>
										{header.isPlaceholder ? null : (
											<button
												type="button"
												className={`flex items-center gap-1 ${header.column.getCanSort() ? "cursor-pointer" : "cursor-default"}`}
												onClick={header.column.getToggleSortingHandler()}
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
												{sortDirection && sortingIndicators[sortDirection]}
											</button>
										)}
									</th>
								);
							})}
						</tr>
					))}
				</thead>

				<tbody>
					{table.getRowModel().rows.map((row, rowIndex) => {
						const href = getRowLink?.(row.original);
						return (
							<tr
								key={row.id}
								className={href ? "cursor-pointer" : ""}
							>
								{row.getVisibleCells().map((cell, index) => (
									<td
										key={cell.id}
										className={`relative px-4 py-3 ${rowIndex % 2 === 1 ? "bg-[#a5d6a7]" : "bg-white"}`}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
										{href && index === 0 && (
											<Link
												to={href}
												className="absolute inset-0"
												aria-label="Open details"
											/>
										)}
									</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default SortableTable;
