import React, { ChangeEvent, useCallback } from "react";
import XTable, { TableEmpty, TablePagination } from "@pcihecklist/react-x-table"
import { ItemToRow } from "../../dist/types"
import TableCell from "@material-ui/core/TableCell";
import { Typography } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TablePaginationBase from "@material-ui/core/TablePagination";

interface DataType extends Object{
  id: number
  name: string
}
const data : DataType[] =[
  {
    id: 1,
    name: 'test9'
  },
  {
    id: 2,
    name: 'test8'
  },
  {
    id: 3,
    name: 'test7'
  },
  {
    id: 4,
    name: 'test6'
  },  {
    id: 5,
    name: 'test5'
  },  {
    id: 6,
    name: 'test4'
  },  {
    id: 7,
    name: 'test3'
  },  {
    id:8 ,
    name: 'test2'
  },  {
    id: 9,
    name: 'test1'
  },





]

const headCells = ['id', 'name']
const App = () => {

  const itemToRow = useCallback((row : DataType)  : ItemToRow<DataType>[] => {
    return [
      {
         type: 'number',
         value: row.id
      },
      {
        type: 'string',
        value: row.name

      }
    ]
  }, [])

  // @ts-ignore
  return <XTable itemToRow={itemToRow} data={data} headCells={headCells} >
     <TableEmpty>

       {({emptyErrorMessage}) => {
         return <TableRow>
           <TableCell align='center' colSpan={3}>
             <Typography variant='subtitle1'>
               {emptyErrorMessage}
             </Typography>
           </TableCell>
         </TableRow>
       }}
     </TableEmpty>

    <TablePagination>
      { ({handleChangePage, rowsPerPage, handleChangeRowsPerPage, rowsCount, rowsPerPageOptions, page}) => {

        const onChange = (_: any, page: number) => {
          handleChangePage(page)
        }


        const onRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
          handleChangeRowsPerPage(parseInt(event.target.value, 10))
        }

        return   <TablePaginationBase
          rowsPerPageOptions={rowsPerPageOptions as number[]}
          component='div'
          count={rowsCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={onChange}
          onChangeRowsPerPage={onRowsPerPageChange}
        />
      } }
    </TablePagination>
    </XTable>
}

export default App
