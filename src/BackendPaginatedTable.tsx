import React, { useCallback, useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { DataParameters, FetchResponse, XTableProps } from './types'
import XTable from './XTable'
import { TablePagination } from './index'
import BackendPaginatedTablePagination from './components/BackendPaginatedTablePagination'

type DataFetch<DataType> = (
  parameters: DataParameters
) => FetchResponse<DataType> | any

export type BackendPaginatedTableProps<DataType> = Omit<
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
    page: rest.defaultPage || 1,
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

  return (
    <XTable
      data={data && data.rows ? data.rows : []}
      totalRowsLength={data.pagination.totalRowsCount}
      {...rest}
      onSortChange={onSortChangeCallback}
      isBackendPowered
    >
      {children}
      <TablePagination>
        {(props) => {
          return (
            <BackendPaginatedTablePagination
              classes={rest.classes?.tablePagination}
              className={rest.classNames?.tablePagination}
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
