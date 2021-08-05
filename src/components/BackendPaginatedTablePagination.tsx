// eslint-disable-next-line no-unused-vars
import React, { ChangeEvent } from 'react'
import TablePaginationBase from '@material-ui/core/TablePagination'
// eslint-disable-next-line no-unused-vars
import { PaginationRenderProps } from './slots/TablePagination'

type Props = PaginationRenderProps & {
  onPageChange: (page: number, rowsPerPage: number) => void
}

const BackendPaginatedTablePagination = ({
  handleChangePage,
  rowsPerPage,
  handleChangeRowsPerPage,
  rowsCount,
  rowsPerPageOptions,
  onPageChange,
  page
}: Props) => {
  const onChange = (_: any, page: number) => {
    handleChangePage(page + 1)
    onPageChange(page + 1, rowsPerPage)
  }

  const onRowsPerPageChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const rowsPerPage = parseInt(event.target.value, 10)
    handleChangeRowsPerPage(rowsPerPage)

    onPageChange(page + 1, rowsPerPage)
  }


  return (
    <TablePaginationBase
      rowsPerPageOptions={rowsPerPageOptions as number[]}
      component='div'
      count={rowsCount}
      rowsPerPage={rowsPerPage}
      page={page - 1}
      onChangePage={onChange}
      onChangeRowsPerPage={onRowsPerPageChanged}
    />
  )
}

export default BackendPaginatedTablePagination
