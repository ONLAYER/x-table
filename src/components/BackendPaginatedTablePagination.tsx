// eslint-disable-next-line no-unused-vars
import React, { ChangeEvent } from 'react'
import TablePaginationBase, {
  TablePaginationClassKey
} from '@material-ui/core/TablePagination'
// eslint-disable-next-line no-unused-vars
import { PaginationRenderProps } from './slots/TablePagination'
import { ClassMap } from '../types'

type Props = PaginationRenderProps & {
  onPageChange: (page: number, rowsPerPage: number) => void
  className?: string
  classes?: ClassMap<TablePaginationClassKey>
  defaultPage?: number
}

const BackendPaginatedTablePagination = ({
  handleChangePage,
  rowsPerPage,
  handleChangeRowsPerPage,
  rowsCount,
  rowsPerPageOptions,
  onPageChange,
  classes,
  className,
  defaultPage = 1,
  page
}: Props) => {
  const onChange = (_: any, page: number) => {
    handleChangePage(page + 1)
    onPageChange(page + 1, rowsPerPage)
  }

  const onRowsPerPageChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const rowsPerPage = parseInt(event.target.value, 10)
    handleChangeRowsPerPage(rowsPerPage)

    onPageChange(defaultPage, rowsPerPage)
  }

  return (
    <TablePaginationBase
      rowsPerPageOptions={rowsPerPageOptions as number[]}
      component='div'
      count={rowsCount}
      classes={classes}
      className={className}
      rowsPerPage={rowsPerPage}
      page={page - 1}
      onChangePage={onChange}
      onChangeRowsPerPage={onRowsPerPageChanged}
    />
  )
}

export default BackendPaginatedTablePagination
