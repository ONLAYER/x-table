// eslint-disable-next-line no-unused-vars
import type { TablePaginationClassKey } from '@material-ui/core/TablePagination'
// eslint-disable-next-line no-unused-vars
import { TableBodyClassKey } from '@material-ui/core/TableBody/TableBody'
// eslint-disable-next-line no-unused-vars
import { TableHeadClassKey } from '@material-ui/core/TableHead/TableHead'
// eslint-disable-next-line no-unused-vars
import { TableClassKey } from '@material-ui/core/Table/Table'
// eslint-disable-next-line no-unused-vars
import { TableRowClassKey } from '@material-ui/core/TableRow/TableRow'
// eslint-disable-next-line no-unused-vars
import { TableContainerClassKey } from '@material-ui/core/TableContainer'
export type HeadCell = {
  numeric?: boolean
  id: string
  disablePadding?: boolean
  label: string
  colSpan?: number
}

export type XTableRef = {
  getSelected: () => SelectedType[]
  setSelected: (selectedIds: SelectedType[]) => void
  excel: (title: string) => Promise<any>
  setPage: (page: number) => void
}

export type CheckRowIsSelectableCallback<DataType> = (
  row: DataType,
  index?: number
) => boolean
export type TableRowProps<DataType> = CustomRowRendererParams<DataType> &
  DataType & {
    style: any
    children: JSX.Element | JSX.Element[]
    className?: string
  }
export type ItemToRow<DataType> = {
  align?: 'left' | 'right'
  type: 'string' | 'number' | 'text' | 'check' | 'render'
  value: string | number | ItemToRowCallback<DataType>
  valueRaw?: any
}

export type ItemToRowCallback<DataType> = (
  row: DataType,
  index?: number
) => ItemToRow<DataType>[]

export type HandleClickCallback = () => void
export type OnSelectCallback<DataType> = (
  row: DataType,
  selected: boolean
) => void
export type SelectedType = string | number
export type OnSelectedChangeCallback = (keys: SelectedType[]) => void
export type ExportRowMapperCallback<DataType> = (
  row: DataType,
  index?: number
) => DataType
export type CustomRowRendererParams<DataType> = Pick<
  XTableProps<DataType>,
  'checkRowIsSelectable' | 'uniqueKey' | 'styled'
> & {
  labelId: string
  key: string | number
  index: number
  onSelect: OnSelectCallback<DataType>
  itemToRow: ItemToRowCallback<DataType>
  handleClick?: HandleClickCallback
  isItemSelected: boolean
}

export type CustomRowRendererCallback<DataType> = (
  row: DataType,
  params?: CustomRowRendererParams<DataType>
) => JSX.Element

type ClassMap<Keys extends string> = {
  [key in Keys]: string
}

type Classes = {
  tablePagination: ClassMap<TablePaginationClassKey>
  tableBody: ClassMap<TableBodyClassKey>
  tableHead: ClassMap<TableHeadClassKey>
  table: ClassMap<TableClassKey>
  tableRow: ClassMap<TableRowClassKey>
  tableContainer: ClassMap<TableContainerClassKey>
}

export type XTableProps<DataType extends Object> = {
  data: DataType[]
  classes: Classes
  headCells: HeadCell[]
  itemToRow: ItemToRowCallback<DataType>
  checkRowIsSelectable?: CheckRowIsSelectableCallback<DataType>
  uniqueKey?: string
  customRowRenderer?: CustomRowRendererCallback<DataType>
  sortOperationAllowedColumns?: string[]
  handleClick?: HandleClickCallback
  loading?: boolean
  styled: any
  defaultRowsPerPage?: number
  shouldPrintExcel: boolean
  pagination?: boolean
  topHeadCells?: HeadCell[]
  defaultOrderDirection?: 'desc' | 'asc'
  defaultOrderField?: string
  showEmptyRows?: boolean
  emptyErrorMessage?: string
  allRowsSelectable?: boolean
  onSelectedChange?: OnSelectedChangeCallback
  rowsPerPageOptions: number[]
  totalRowsLength?: number
  dense: false
}
