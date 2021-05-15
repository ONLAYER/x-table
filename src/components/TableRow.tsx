import TableCell from '@material-ui/core/TableCell'
import Checkbox from '@material-ui/core/Checkbox'
import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import makeStyles from '@material-ui/core/styles/makeStyles'
// eslint-disable-next-line no-unused-vars
import type { ItemToRow, TableRowProps } from '../types'

const useStyles = makeStyles((theme) => ({
  firstCell: {
    position: 'sticky',
    background: `${theme.palette.primary.dark}`,
    borderRight: `1px solid ${theme.palette.secondary.dark} !important`,
    left: 0,
    padding: 5,
    zIndex: 1
  }
}))

const TableRowItem = <DataType extends Object>({
  itemToRow,
  checkRowIsSelectable,
  isItemSelected,
  index,
  onSelect,
  uniqueKey,
  labelId,
  style,
  children,
  className,
  handleClick,
  ...rest
}: TableRowProps<DataType>) => {
  const classes = useStyles()

  const selectable = checkRowIsSelectable
    ? checkRowIsSelectable(rest as DataType, index)
    : true
  return (
    <TableRow
      hover
      // onClick={(event) => handleClick(event, rest)}
      role='checkbox'
      aria-checked={isItemSelected}
      tabIndex={-1}
      style={style}
      className={className}
      selected={isItemSelected}
    >
      {uniqueKey ? (
        <TableCell padding='checkbox'>
          <Checkbox
            checked={isItemSelected}
            disabled={!selectable}
            onChange={() => onSelect(rest as DataType, isItemSelected)}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </TableCell>
      ) : null}

      {renderRow<DataType>(itemToRow(rest as DataType, index), classes)}

      {children}
    </TableRow>
  )
}

const renderRow = <DataType extends Object>(
  row: ItemToRow<DataType>[],
  classes: any
) => {
  return row.map((rowItem, i) => {
    if (rowItem.type === 'number') {
      return (
        <TableCell
          className={i === 0 ? classes.firstCell : null}
          key={i}
          align={rowItem.align || 'right'}
        >
          {rowItem.value}
        </TableCell>
      )
    } else {
      return (
        <TableCell
          className={i === 0 ? classes.firstCell : null}
          key={i}
          align={rowItem.align || 'left'}
        >
          {rowItem.value}
        </TableCell>
      )
    }
  })
}

export default React.memo(TableRowItem)
