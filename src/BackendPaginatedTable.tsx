import React, { useCallback } from 'react'
// eslint-disable-next-line no-unused-vars
import { XTableProps } from './types'
import XTable from './XTable'
import { TablePagination } from './index'
import BackendPaginatedTablePagination from './components/BackendPaginatedTablePagination'

type PaginationData = {
  totalRowsCount: number
  page?: number
  next?: number
  prev?: number
}

type FetchResponse<DataType> = {
  rows: DataType[]
  pagination: PaginationData
}
type DataFetch<DataType> = (
  page: number,
  rowsPerPage: number
) => FetchResponse<DataType>

type BackendPaginatedTableProps<DataType> = Omit<
  XTableProps<DataType>,
  'data'
> & {
  fetch: DataFetch<DataType>
  data: FetchResponse<DataType>
}

const BackendPaginatedTable = <DataType extends Object>({
  fetch,
  data,
  children,
  ...rest
}: BackendPaginatedTableProps<DataType>) => {
  const onPageChange = useCallback(
    (page: number, rowsPerPage: number) => {
      fetch(page, rowsPerPage)
    },
    [fetch]
  )
  return (
    <XTable data={data && data.rows ? data.rows : []} {...rest}>
      {children}
      <TablePagination>
        {(props) => {
          return (
            <BackendPaginatedTablePagination
              onPageChange={onPageChange}
              {...props}
            />
          )
        }}
      </TablePagination>
    </XTable>
  )
}

export default BackendPaginatedTable
