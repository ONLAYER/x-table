import React from 'react'
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
type DataFetch<DataType> = (page: number) => FetchResponse<DataType>

type BackendPaginatedTableProps<DataType> = XTableProps<DataType> & {
  fetch: DataFetch<DataType>
}

const BackendPaginatedTable = <DataType extends Object>({
  fetch,
  ...rest
}: BackendPaginatedTableProps<DataType>) => {
  return (
    <XTable {...rest}>
      <TablePagination>
        {(props) => {
          return <BackendPaginatedTablePagination {...props} />
        }}
      </TablePagination>
    </XTable>
  )
}

export default BackendPaginatedTable
