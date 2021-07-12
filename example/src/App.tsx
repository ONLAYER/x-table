import React, { useCallback } from "react";
import { ItemToRow } from "../../dist/types"

import {BackendPaginatedTable, DataParameters}  from "@pcihecklist/react-x-table";

interface DataType extends Object{
  id: number
  name: string
}
const data : DataType[] =[
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


  const fetchCallback = useCallback(({page, rowsPerPage, sortDirection, sortField}: DataParameters) => {
    console.log(page, rowsPerPage, sortField, sortDirection)

  }, [])
  // @ts-ignore
  return <BackendPaginatedTable itemToRow={itemToRow} data={data} headCells={headCells}   fetch={fetchCallback}/>
}

export default App
