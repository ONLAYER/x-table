// @ts-ignore
// eslint-disable-next-line no-unused-vars
import type { XTableProps } from '../../types'

type RenderProps<ObjectType> = {
  emptyErrorMessage: XTableProps<ObjectType>['emptyErrorMessage']
  loading: XTableProps<ObjectType>['loading']
}

type TablePaginationRenderProps<ObjectType> = (
  renderProps: RenderProps<ObjectType>
) => JSX.Element | JSX.Element[]

type Props<ObjectType extends Object> = {
  children: TablePaginationRenderProps<ObjectType>
}

const TableEmpty = <ObjectType extends Object>({
  children
}: Props<ObjectType>) => {
  return children
}

export default TableEmpty
