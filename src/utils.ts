import type {
  // eslint-disable-next-line no-unused-vars
  ExportRowMapperCallback,
  // eslint-disable-next-line no-unused-vars
  HeadCellObject,
  // eslint-disable-next-line no-unused-vars
  XTableProps
} from './types'
import React from 'react'

type ExportResponse = {
  rows: any[]
  headers: string[]
  topHeadCells?: HeadCellObject[]
}

export function prepareDataToExport<DataType>(
  headCells: HeadCellObject[],
  topHeadCells: HeadCellObject[],
  rows: DataType[],
  itemToRow: XTableProps<DataType>['itemToRow'],
  exportRowMapper?: ExportRowMapperCallback<DataType>
): ExportResponse {
  const headersNew: string[] = []
  const headers: string[] = headCells.map((cell) => cell.label)

  const exportRows: Object[] = rows.map((row, index) => {
    const data: any[] = []

    // if we are defined a callback to map rows  call it now
    if (exportRowMapper) {
      row = exportRowMapper(row)
    }

    itemToRow &&
      itemToRow(row, index).forEach((item, i) => {
        const type = item.type

        if (
          (type === 'text' || type === 'number') &&
          !React.isValidElement(item.value)
        ) {
          data.push(item.value)

          if (headers[i] !== undefined && !headersNew.includes(headers[i])) {
            headersNew.push(headers[i])
          }
        } else if (
          type === 'render' &&
          item.valueRaw &&
          !React.isValidElement(item.valueRaw)
        ) {
          data.push(item.valueRaw)

          if (
            headers[i] !== undefined &&
            headersNew.includes(headers[i]) === false
          ) {
            headersNew.push(headers[i])
          }
        }
      })

    return data
  })

  return { rows: exportRows, headers: headersNew, topHeadCells }
}

export function descendingComparator<DataType>(
  a: DataType,
  b: DataType,
  orderBy: string
) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export function getComparator<DataType>(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: DataType, b: DataType) =>
        descendingComparator<DataType>(a, b, orderBy)
    : (a: DataType, b: DataType) =>
        -descendingComparator<DataType>(a, b, orderBy)
}

export function stableSort(array: any[], comparator: any) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}
