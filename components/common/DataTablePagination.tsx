import {Table} from "@tanstack/react-table"
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "lucide-react"

import {Button, Select} from "@arco-design/web-react"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({table}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} 已选中
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <Select
                        value={table.getState().pagination.pageSize}
                        onChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                        style={{width: 70}}
                        size="small"
                    >
                        {[10, 20, 50, 100].map((pageSize) => (
                            <Select.Option key={pageSize} value={pageSize}>
                                {pageSize}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        type="text"
                        shape="circle"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        type="text"
                        shape="circle"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        type="text"
                        shape="circle"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight />
                    </Button>
                    <Button
                        type="text"
                        shape="circle"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}
