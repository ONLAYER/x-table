import { DataParameters, FetchResponse } from '../types'
import BackendPaginatedTable, {
  BackendPaginatedTableProps
} from '../BackendPaginatedTable'
import React, { useCallback, useEffect, useRef, useState } from 'react'

type DataFetch<DataType, ExtraParameters = {}> = (
  parameters: DataParameters<ExtraParameters>
) => Promise<FetchResponse<DataType>>
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type Props<DataType, ExtraParameters> = Omit<
  BackendPaginatedTableProps<DataType>,
  'fetch' | 'data'
> & {
  fetch: DataFetch<DataType>
  extraParameters?: ExtraParameters
  useCache?: boolean
}

export default function useBackendPaginatedTable<
  DataType,
  ExtraParameters extends Object
>({
  fetch: fetchCallback,
  extraParameters,
  useCache = true,
  ...rest
}: Props<DataType, ExtraParameters>) {
  const [data, setData] = useState<FetchResponse<DataType>>({
    rows: [],
    pagination: {
      totalRowsCount: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const cache = useRef({})

  const [state, setState] = useState({
    page: rest.defaultPage || 1,
    sortField: rest.defaultOrderField,
    sortDirection: rest.defaultOrderDirection,
    rowsPerPage: rest.defaultRowsPerPage || 5
  })

  const fetch = useCallback(
    ({ page, rowsPerPage, sortDirection, sortField }) => {
      setState({ page, rowsPerPage, sortDirection, sortField })
    },
    [fetchCallback]
  )

  const runFetch = useCallback(async () => {
    setState(state)
    const { page, rowsPerPage, sortDirection, sortField } = state

    // if we decided to use cache and  we fetched this page previously, use the previous cache result
    // otherwise continue to progress normally
    // we also make sure extraParameters has not been changed since the last time,
    // if it has, we need to reload the page otherwise it won't be updated
    if (
      useCache &&
      typeof cache.current[page] !== 'undefined' &&
      cache.current[page].extraParameters !== extraParameters
    ) {
      return setData(cache.current[page].response)
    }
    setLoading(true)

    const response = await fetchCallback({
      page,
      rowsPerPage,
      sortDirection,
      sortField,
      ...extraParameters
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

    if (useCache === true) {
      cache.current = {
        ...cache.current,
        [page]: { response: response, extraParameters }
      }
    }

    setData((prevState) => ({
      ...prevState,
      pagination: response.pagination,
      rows: response.rows
    }))

    setLoading(false)
  }, [state, extraParameters])

  useEffect(() => {
    runFetch()
  }, [state, extraParameters])

  return (
    <BackendPaginatedTable
      {...rest}
      fetch={fetch}
      loading={loading || rest.loading}
      data={data}
    />
  )
}
