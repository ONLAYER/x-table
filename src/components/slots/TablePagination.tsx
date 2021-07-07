import React from 'react'
// @ts-ignore
// eslint-disable-next-line no-unused-vars
import type { XTableProps } from '../../types'

export type PaginationRenderProps = {
  rowsPerPageOptions: number[]
  page: number
  handleChangePage: (page: number) => void
  handleChangeRowsPerPage: (rowsPerPage: number) => void
  rowsCount: number
  rowsPerPage: number
}

export type TablePaginationRenderProps = (
  renderProps: PaginationRenderProps
) => JSX.Element | JSX.Element[]

type Props = {
  children: TablePaginationRenderProps
}

const TablePagination =({
  children
}: Props) => {
  return <React.Fragment>{children}</React.Fragment>
}

export default TablePagination
