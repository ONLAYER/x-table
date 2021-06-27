// @ts-ignore
// eslint-disable-next-line no-unused-vars
import type { XTableProps } from '../../types'

type RenderProps<ObjectType> = {
  rowsPerPageOptions: XTableProps<ObjectType>['rowsPerPageOptions']
  page: number
  handleChangePage: (page: number) => void
  handleChangeRowsPerPage: (rowsPerPage: number) => void
}

type TablePaginationRenderProps<ObjectType> = (
  renderProps: RenderProps<ObjectType>
) => JSX.Element | JSX.Element[]

type Props<ObjectType extends Object> = {
  children: TablePaginationRenderProps<ObjectType>
}

const TablePagination = <ObjectType extends Object>({
  children
}: Props<ObjectType>) => {
  return children
}

export default TablePagination
