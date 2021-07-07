import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

import TableHead from '@material-ui/core/TableHead'
// eslint-disable-next-line no-unused-vars
import type { HeadCellObject } from '../types'
import makeStyles from '@material-ui/core/styles/makeStyles'

type Props = {
  data: HeadCellObject[]
}

const useStyles = makeStyles(() => ({
  tableTopHeader: {
    borderRight: '1px solid #22304B',
    opacity: 0.5
  }
}))

const TableTopHead = React.memo(({ data }: Props) => {
  const classes = useStyles()

  return (
    <TableHead>
      <TableRow>
        {data.map((item, index) => (
          <TableCell
            key={index}
            colSpan={item.colSpan}
            align='center'
            className={classes.tableTopHeader}
          >
            {item.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
})

export default TableTopHead
