import { DataParameters, FetchResponse } from '../types'
import BackendPaginatedTable, {
  BackendPaginatedTableProps
} from '../BackendPaginatedTable'
import React, { useCallback, useState } from 'react'

type DataFetch<DataType> = (
  parameters: DataParameters
) => FetchResponse<DataType>

type Props<DataType> = BackendPaginatedTableProps<DataType> & {
  fetchCallback: DataFetch<DataType>
}

export default function useBackendPaginatedTable<DataType>({
  fetchCallback,
  ...rest
}: Props<DataType>) {
  const [data, setData] = useState<FetchResponse<DataType>>({
    rows: [],
    pagination: {
      totalRowsCount: 0
    }
  })
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(
    ({ page, rowsPerPage, sortDirection, sortField }) => {
      setLoading(true)
      const response = fetchCallback({
        page,
        rowsPerPage,
        sortDirection,
        sortField
      })

      if (!response?.pagination || !response?.rows) {
        throw new Error(
          `[fetchCallback] response must include both pagination and rows values, actual pagination: ${typeof response?.pagination}, actual rows: ${typeof response?.rows}`
        )
      }

      if (
        !response?.pagination.totalRowsCount &&
        typeof !response?.pagination.totalRowsCount !== 'number'
      ) {
        throw new Error(
          `[fetchCallback] response's pagination must include totalRowsCounts, none found.`
        )
      }

      setData((prevState) => ({
        ...prevState,
        pagination: response.pagination,
        rows: response.rows
      }))

      setLoading(false)
    },
    [fetchCallback]
  )

  return (
    <BackendPaginatedTable
      {...rest}
      fetch={fetch}
      loading={loading || rest.loading}
      data={data}
    />
  )
}
