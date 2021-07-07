// eslint-disable-next-line no-unused-vars
import React, { ChangeEvent } from 'react'
import TablePaginationBase from '@material-ui/core/TablePagination'
import { PaginationRenderProps } from './slots/TablePagination'

const BackendPaginatedTablePagination = ({
  handleChangePage,
  rowsPerPage,
  handleChangeRowsPerPage,
  rowsCount,
  rowsPerPageOptions,
  page
}: PaginationRenderProps) => {
  const onChange = (_: any, page: number) => {
    handleChangePage(page)
  }

  const onRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleChangeRowsPerPage(parseInt(event.target.value, 10))
  }

  return (
    <TablePaginationBase
      rowsPerPageOptions={rowsPerPageOptions as number[]}
      component='div'
      count={rowsCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={onChange}
      onChangeRowsPerPage={onRowsPerPageChange}
    />
  )
}

export default BackendPaginatedTablePagination
