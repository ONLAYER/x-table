// @ts-ignore
// eslint-disable-next-line no-unused-vars
import type { XTableProps } from '../../types'

type RenderProps<ObjectType> = {
  headCells: XTableProps<ObjectType>['headCells']
  selectedCount: number
  order: string
  sortableColumns: number[]
  orderBy: string
  uniqueKey: XTableProps<ObjectType>['uniqueKey']
  handleSelectAllClick: (e: any) => void
  handleRequestSort: (orderBy: string, direction: 'asc' | 'desc') => void
  rowCount: number
  selectableRowCount: number
}

type TableHeadRenderProps<ObjectType> = (
  renderProps: RenderProps<ObjectType>
) => JSX.Element | JSX.Element[]

type Props<ObjectType extends Object> = {
  children: TableHeadRenderProps<ObjectType>
}

const TableHead = <ObjectType extends Object>({
  children
}: Props<ObjectType>) => {
  return children
}

export default TableHead
