import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Checkbox from '@material-ui/core/Checkbox'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
// eslint-disable-next-line no-unused-vars
import { HeadCellObject } from '../types'

type Props = {
  headCells: HeadCellObject[]
  sortableIndexes: number[]
  order: 'desc' | 'asc'
  orderBy?: string
  numSelected: number
  uniqueKey?: string
  rowCount: number
  onSelectAllClick: (e: any) => void
  onRequestSort: (e: any, property: string) => void
}

const useStyles = makeStyles(() => ({
  firstCell: {
    position: 'sticky',
    left: 0,
    padding: 5,
    zIndex: 1
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
}))

function EnhancedTableHead({ headCells, ...rest }: Props) {
  const {
    sortableIndexes = [],
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    uniqueKey,
    rowCount,
    onRequestSort
  } = rest
  // @ts-ignore
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  const classes = useStyles()

  return (
    <TableHead>
      <TableRow>
        {uniqueKey ? (
          <TableCell padding='checkbox'>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
            />
          </TableCell>
        ) : null}

        {headCells.map((headCell, i) => (
          <TableCell
            className={i === 0 ? classes.firstCell : undefined}
            key={headCell.id}
            align={
              headCell.colSpan ? 'center' : headCell.numeric ? 'right' : 'left'
            }
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            colSpan={headCell.colSpan ? headCell.colSpan : 0}
          >
            {sortableIndexes.includes(i) ? (
              <TableSortLabel
                hideSortIcon={!sortableIndexes.includes(i)}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default React.memo(EnhancedTableHead)
