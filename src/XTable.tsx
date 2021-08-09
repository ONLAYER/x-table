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
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'

import type {
  // eslint-disable-next-line no-unused-vars
  CustomRowRendererParams,
  // eslint-disable-next-line no-unused-vars
  HeadCellObject,
  // eslint-disable-next-line no-unused-vars
  SelectedType,
  // eslint-disable-next-line no-unused-vars
  XTableProps,
  // eslint-disable-next-line no-unused-vars
  XTableRef,
  // eslint-disable-next-line no-unused-vars
  Slots
} from './types'

import { getComparator, prepareDataToExport, stableSort } from './utils'
import exportToExcel from './exportToExcel'
import TableTopHead from './components/TableTopHead'
import EnhancedTableHead from './components/EnhancedTableHead'
import useSlots from './useSlots'

const rowsOptions = [5, 10, 25]

const XTable = React.forwardRef<XTableRef, XTableProps<Object>>(
  (props, ref) => {
    const {
      data,
      headCells: headCellsBasic,
      handleClick,
      itemToRow,
      shouldPrintExcel = false,
      checkRowIsSelectable,
      uniqueKey = undefined,
      customRowRenderer,
      defaultOrderDirection = 'desc',
      defaultOrderField = undefined,
      styled = false,
      sortOperationAllowedColumns,
      loading = false,
      topHeadCells = undefined,
      defaultRowsPerPage = 5,
      pagination = true,
      defaultPage = 1,
      isBackendPowered = false,
      showEmptyRows = true,
      emptyErrorMessage = 'noDataAvailableForThisTable',
      onSelectedChange,
      rowsPerPageOptions = rowsOptions,
      dense = false,
      totalRowsLength,
      onSortChange,
      classes = {},
      children,
      classNames = {},
      styles = {}
    } = props

    const slots = useSlots({ children }) as Slots<Object>

    // this memo will convert that headCell  as passed array of strings to  array of objects
    const headCells = useMemo<HeadCellObject[]>(() => {
      const firstCell = headCellsBasic[0]

      // if firstcell is not defined we cannot determine
      // whether the headcells are array of object or array of string
      // so we return an empty array,
      // this also can be happen for some reason user sends the  first element of object as undefined
      if (typeof firstCell === 'undefined') {
        return []
      }

      // our first cell is object therefore we assume we are given array of objects
      if (typeof firstCell === 'object') {
        return headCellsBasic as unknown as HeadCellObject[]
      }

      if (typeof firstCell === 'string') {
        return headCellsBasic.map<HeadCellObject>((item: string) => {
          return {
            id: item,
            numeric: item.toLocaleLowerCase().includes('id'),
            label: item
          }
        })
      }

      throw new Error(
        `headCells prop accepts array of objects or array of strings, XTable looks for  first element of headCells, and your first elements type is ${typeof firstCell}`
      )
    }, [headCellsBasic])

    // const classes = useStyles()
    const [order, setOrder] = useState(defaultOrderDirection)
    const [orderBy, setOrderBy] = useState(defaultOrderField)
    const [selected, setSelected] = useState<SelectedType[]>([])
    const [page, setPage] = useState(defaultPage)
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
      } else if (rows && rows.length && itemToRow) {
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

    console.log(sortableColumns, 'sortable columns')
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
        const newOrder =
          orderBy === property && order === 'asc' ? 'desc' : 'asc'
        // for anyone who is considered because this might cause performance issues,
        // this is fine. React uses batch to update multiple states,
        setOrder(newOrder)
        setOrderBy(property)

        // notify the parent listener
        if (onSortChange) {
          onSortChange(property, newOrder)
        }
      },
      [orderBy, order, onSortChange]
    )

    const handleSelectAllClick = useCallback(
      (event) => {
        if (event.target.checked && uniqueKey) {
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
    const handleChangePage = (_, newPage) => handleChangePageCallback(newPage)
    const handleChangePageCallback = useCallback((page: number) => {
      setPage(page)
    }, [])

    // @ts-ignore
    // todo: add appropriate definitions
    const handleChangeRowsPerPage = (event) => {
      handleChangeRowsPerPageCallback(parseInt(event.target.value, 10))
    }

    const handleChangeRowsPerPageCallback = useCallback(
      (rowsPerPage: number) => {
        setRowsPerPage(rowsPerPage)
        setPage(0)
      },
      []
    )

    const isSelected = useCallback(
      (id: SelectedType) => selected.indexOf(id) !== -1,
      [selected]
    )
    const onSelect = useCallback(
      (row, selected) => {
        if (uniqueKey) {
          setSelected((prevState) =>
            selected
              ? prevState.filter((item) => item !== row[uniqueKey])
              : [...prevState, row[uniqueKey]]
          )
        }
      },
      [setSelected]
    )

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
        isSelected,
        checkRowIsSelectable
      ]
    )

    const emptyRows = rowsPerPage > rowsLength ? 5 - rowsLength : null

    // here we check if this sort should be handled by backend
    // isBackendPowered must be set true if we want to achieve this
    const rowsSorted = useMemo<Object[]>(() => {
      return orderBy && !isBackendPowered
        ? stableSort(rows, getComparator<Object>(order, orderBy))
        : rows
    }, [orderBy, order, rows, isBackendPowered])

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


    // here we render rows
    // in order to work properly with BackendPagiantedTable we had to make a small adjustment here
    const renderedRows = useMemo(() => {
      const rowsToMap = isBackendPowered
        ? rowsSorted
        : rowsSorted &&
          rowsSorted.slice(
            (page - 1) * rowsPerPage,
            (page - 1) * rowsPerPage + rowsPerPage
          )

      return rowsToMap.map(rowRenderer)
    }, [rowsSorted, page, rowsPerPage, isBackendPowered, rowRenderer])

    return (
      <React.Fragment>
        {loading ? (
          <LinearProgress className='my-5 p-3' color='secondary' />
        ) : null}
        <TableContainer
          style={styles.tableContainer}
          className={classNames.tableContainer}
          classes={classes.tableContainer}
        >
          <Table
            style={styles.table}
            classes={classes.table}
            className={classNames.table}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
            aria-label='enhanced table'
          >
            {topHeadCells ? <TableTopHead data={topHeadCells} /> : null}

            {slots.TableHead ? (
              slots.TableHead({
                order,
                orderBy,
                headCells,
                handleRequestSort,
                handleSelectAllClick,
                selectableRowCount: selecteableRowCount,
                sortableColumns,
                selectedCount: selected.length,
                uniqueKey,
                rowCount: rowsLength
              })
            ) : (
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
            )}
            <TableBody
              style={styles.tableBody}
              className={classNames.tableBody}
              classes={classes.tableBody}
            >
              {renderedRows}

              {!loading && rowsLength === 0 ? (
                slots.TableEmpty ? (
                  slots.TableEmpty({ emptyErrorMessage, loading })
                ) : (
                  <TableRow
                    style={styles.tableEmptyRow}
                    className={classNames.tableEmptyRow}
                    classes={classes.tableEmptyRow}
                  >
                    <TableCell align='center' colSpan={headCells.length + 1}>
                      <Typography variant='subtitle1'>
                        {emptyErrorMessage}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              ) : null}

              {showEmptyRows && emptyRows && emptyRows > 0 && (
                <TableRow
                  className={classNames.tableEmptyRow}
                  classes={classes.tableEmptyRow}
                  style={{ height: (dense ? 33 : 53) * emptyRows }}
                >
                  <TableCell colSpan={headCells.length + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {pagination ? (
          slots.TablePagination ? (
            slots.TablePagination({
              handleChangePage: handleChangePageCallback,
              handleChangeRowsPerPage: handleChangeRowsPerPageCallback,
              page,
              rowsPerPageOptions,
              rowsCount: rowsLength,
              rowsPerPage
            })
          ) : (
            <TablePagination
              className={classNames.tablePagination}
              classes={classes.tablePagination}
              rowsPerPageOptions={rowsPerPageOptions}
              component='div'
              count={rowsLength}
              rowsPerPage={rowsPerPage}
              page={page - 1 < 0 ? 0 : page - 1}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          )
        ) : null}
      </React.Fragment>
    )
  }
)

export default React.memo(XTable)
