import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table"
import BSTable from "react-bootstrap/Table";
import { useState } from "react";

interface SortableTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

const sortingIndicators = {
	asc: "▲",
	desc: "▼"
}

const SortableTable = <TData, TValue>({ columns, data }: SortableTableProps<TData, TValue>) => {
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
		<BSTable>
			<thead>
				{table.getHeaderGroups().map(headerGroup => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map(header => {
							const sortDirection = header.column.getIsSorted();

							return (
								<th key={header.id} colSpan={header.colSpan}>
									{header.isPlaceholder
										? null
										: <div
											className={header.column.getCanSort() ? "sortable" : ""}
											onClick={header.column.getToggleSortingHandler()}
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}

											{sortDirection && sortingIndicators[sortDirection]}
										</div>
									}
								</th>
							)
						})}
					</tr>
				))}
			</thead>

			<tbody>
				{table.getRowModel().rows.map(row => (
					<tr key={row.id}>
						{row.getVisibleCells().map(cell => (
							<td key={cell.id} className={cell.column.columnDef.meta?.align || ""}>
								{flexRender(
									cell.column.columnDef.cell,
									cell.getContext()
								)}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</BSTable>
	)
}

export default SortableTable;