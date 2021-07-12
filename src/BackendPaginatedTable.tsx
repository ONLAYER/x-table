import React, { useCallback, useState, useEffect } from 'react'
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

export type DataParameters = {
  page: number
  rowsPerPage: number
  sortField?: string
  sortDirection?: string
}

type DataFetch<DataType> = (
  parameters: DataParameters
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
  onSortChange,
  ...rest
}: BackendPaginatedTableProps<DataType>) => {
  const [parameters, setParameters] = useState<DataParameters>({
    page: rest.defaultPage || 0,
    sortField: rest.defaultOrderField,
    sortDirection: rest.defaultOrderDirection,
    rowsPerPage: rest.defaultRowsPerPage || 5
  })

  const onSortChangeCallback = useCallback(
    (sortField: string, sortDirection: string) => {
      setParameters((parameters) => ({
        ...parameters,
        sortField,
        sortDirection
      }))
    },
    [onSortChange]
  )

  const onPageChange = useCallback((page: number, rows: number) => {
    setParameters((parameters) => ({ ...parameters, page, rows }))
  }, [])

  useEffect(() => {
    fetch(parameters)
  }, [parameters])

  console.log('here', parameters)
  return (
    <XTable
      data={data && data.rows ? data.rows : []}
      {...rest}
      onSortChange={onSortChangeCallback}
    >
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
