import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useImperativeHandle
} from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableRowItem from './components/TableRow'
import { Typography } from '@material-ui/core'
import LinearProgress from '@material-ui/core/LinearProgress'

import type {
  // eslint-disable-next-line no-unused-vars
  CustomRowRendererParams,
  // eslint-disable-next-line no-unused-vars
  SelectedType,
  // eslint-disable-next-line no-unused-vars
  XTableProps,
  // eslint-disable-next-line no-unused-vars
  XTableRef
} from './types'

import { getComparator, prepareDataToExport, stableSort } from './utils'
import exportToExcel from './exportToExcel'
import TableTopHead from './components/TableTopHead'
import EnhancedTableHead from './components/EnhancedTableHead'

const rowsOptions = [5, 10, 25]

const XTable = React.forwardRef<XTableRef, XTableProps<Object>>(
  (props, ref) => {
    const {
      data,
      headCells,
      handleClick,
      itemToRow,
      shouldPrintExcel = false,
      checkRowIsSelectable,
      uniqueKey = 'id',
      customRowRenderer,
      defaultOrderDirection = 'desc',
      defaultOrderField = undefined,
      styled = false,
      sortOperationAllowedColumns,
      loading = undefined,
      topHeadCells = undefined,
      defaultRowsPerPage = 5,
      pagination = true,
      showEmptyRows = true,
      emptyErrorMessage = 'noDataAvailableForThisTable',
      onSelectedChange,
      rowsPerPageOptions = rowsOptions,
      dense = false,
      totalRowsLength,
      classes
    } = props

    // const classes = useStyles()
    const [order, setOrder] = useState(defaultOrderDirection)
    const [orderBy, setOrderBy] = useState(defaultOrderField)
    const [selected, setSelected] = useState<SelectedType[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)
    const rows = data
    const rowsLength =
      typeof totalRowsLength !== 'undefined'
        ? totalRowsLength
        : rows && rows.length
        ? rows.length
        : 0

    const sortableColumns = useMemo<number[]>(() => {
      let columns: number[] = []

      if (sortOperationAllowedColumns) {
        columns = headCells
          .map((_, i) => ({ index: i, label: _.id }))
          .filter((cell) => sortOperationAllowedColumns.includes(cell.label))
          .map((item) => item.index)
      } else if (rows && rows.length) {
        const row = itemToRow(rows[0])

        row.forEach((row, i) => {
          const type = row.type
          if (
            type === 'text' ||
            type === 'number' ||
            type === 'check' ||
            row.valueRaw
          ) {
            columns.push(i)
          }
        })
      }

      return columns
    }, [rows, sortOperationAllowedColumns])

    useEffect(() => {
      if (onSelectedChange) {
        onSelectedChange(selected)
      }
    }, [selected])

    const exportExcel = useCallback(
      (title: string): Promise<any> => {
        if (shouldPrintExcel) {
          const onlySelectedRows =
            uniqueKey && selected.length
              ? rows.filter((item) => selected.includes(item[uniqueKey]))
              : rows

          const newHeads = topHeadCells || []

          const data = prepareDataToExport(
            headCells,
            newHeads,
            onlySelectedRows,
            itemToRow
          )

          return exportToExcel(data.headers, data.rows, title)
        }

        return new Promise<null>((resolve) => resolve(null))
      },
      [rows, topHeadCells, shouldPrintExcel, uniqueKey, selected]
    )

    useImperativeHandle(
      ref,
      () => ({
        getSelected: () => selected,
        setSelected: (selectedIds: SelectedType[]) => setSelected(selectedIds),
        excel: (title: string) => exportExcel(title),
        setPage: (page: number) => setPage(page)
      }),
      [selected]
    )

    const handleRequestSort = useCallback(
      (_, property) => {
        setOrder((order) =>
          orderBy === property && order === 'asc' ? 'desc' : 'asc'
        )
        setOrderBy(property)
      },
      [orderBy]
    )

    const handleSelectAllClick = useCallback(
      (event) => {
        if (event.target.checked) {
          return setSelected(
            rows
              .filter((row, i) => {
                if (checkRowIsSelectable) {
                  return checkRowIsSelectable(row, i)
                }

                return true
              })
              .map((n) => n[uniqueKey])
          )
        }
        setSelected([])
      },
      [uniqueKey, rows, checkRowIsSelectable]
    )

    // @ts-ignore
    // todo: add appropriate definitions
    const handleChangePage = (_, newPage) => {
      setPage(newPage)
    }

    // @ts-ignore
    // todo: add appropriate definitions
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      setPage(0)
    }

    const isSelected = (id: SelectedType) => selected.indexOf(id) !== -1
    const onSelect = useCallback((row, selected) => {
      setSelected((prevState) =>
        selected
          ? prevState.filter((item) => item !== row[uniqueKey])
          : [...prevState, row[uniqueKey]]
      )
    }, [])

    //  x-table support 2 variants of row rendering
    // one is rendering by itemToRow props which is rendering is handled by TableRow Component based on how user desired
    // to be rendered in itemToRow
    // the other is by customRowRenderer callback which we pass row parameter and bunch of other props
    // and users itself renders how it wants to be rendered
    const rowRenderer = useCallback(
      (row, index) => {
        const isItemSelected = uniqueKey ? isSelected(row[uniqueKey]) : false
        const labelId = `enhanced-table-checkbox-${index}`
        const key = uniqueKey ? row[uniqueKey] : index

        const params: CustomRowRendererParams<Object> = {
          labelId,
          key,
          index,
          onSelect,
          itemToRow,
          styled,
          handleClick,
          checkRowIsSelectable,
          uniqueKey,
          isItemSelected
        }

        if (customRowRenderer) {
          return customRowRenderer(row, params)
        }
        return <TableRowItem {...params} {...row} />
      },
      [
        itemToRow,
        styled,
        onSelect,
        customRowRenderer,
        selected,
        checkRowIsSelectable
      ]
    )

    const emptyRows =
      rowsPerPage > (rows?.length || []) ? 5 - rows?.length : null
    const rowsSorted = orderBy
      ? stableSort(rows, getComparator<Object>(order, orderBy))
      : rows

    // in some tables only some rows should be selectable
    // such as onboarding completed table, so in  order to achieve that
    // we use a callback prop called checkRowIsSelectable this callback
    // determines a specific column is selectable or not
    // but when we do that we also need to check if all the rows that are selectable
    // are selected or not. this useMemo is used to achieve that.
    const selecteableRowCount = useMemo(() => {
      return !checkRowIsSelectable
        ? rows?.length || 0
        : rows.filter((row, i) => checkRowIsSelectable(row, i)).length
    }, [checkRowIsSelectable, rows])

    return (
      <>
        {loading ? (
          <LinearProgress className='my-5 p-3' color='secondary' />
        ) : null}
        <TableContainer classes={classes.tableContainer}>
          <Table
            classes={classes.table}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
            aria-label='enhanced table'
          >
            {topHeadCells ? <TableTopHead data={topHeadCells} /> : null}

            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              sortableIndexes={sortableColumns}
              orderBy={orderBy}
              uniqueKey={uniqueKey}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={selecteableRowCount}
            />
            <TableBody classes={classes.tableBody}>
              {rowsSorted &&
                rowsSorted
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(rowRenderer)}

              {loading === false && rows.length === 0 ? (
                <TableRow classes={classes.tableRow}>
                  <TableCell align='center' colSpan={headCells.length + 1}>
                    <Typography variant='subtitle1'>
                      {emptyErrorMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : null}

              {showEmptyRows && emptyRows && emptyRows > 0 && (
                <TableRow
                  classes={classes.tableRow}
                  style={{ height: (dense ? 33 : 53) * emptyRows }}
                >
                  <TableCell colSpan={headCells.length + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {pagination && (rowsLength > rowsPerPage || rowsLength > 5) ? (
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component='div'
            count={rowsLength}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        ) : null}
      </>
    )
  }
)

export default React.memo(XTable)
