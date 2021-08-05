import React, { useCallback, useMemo, useState } from "react";
import { ItemToRow } from "../../dist/types";

import { BackendPaginatedTable, DataParameters } from "@pcihecklist/react-x-table";
import { makeStyles } from "@material-ui/core";

function getQueryString(params: Object): string {
  return Object
    .keys(params)
    .filter(key => params[key] != undefined)
    .map(k => {
      if (Array.isArray(params[k])) {
        return params[k]
          .map((val: any) => `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`)
          .join("&");
      }

      return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
    })
    .join("&");
}

const useStyles = makeStyles(() => ({
  testBackground: {
    backgroundColor: '#f00'
  }
}))
interface DataType extends Object {
  id: number
  name: string
  createdAt: string
}

const headCells = ["id", "name"];
const App = () => {

  const classes = useStyles()
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const itemToRow = useCallback((row: DataType): ItemToRow<DataType>[] => {
    return [
      {
        type: "number",
        value: row.id
      },
      {
        type: "string",
        value: row.name

      },
      {
        type: "string",
        value: row.createdAt

      }
    ];
  }, []);


  const fetchCallback = useCallback(({ page, rowsPerPage, sortDirection, sortField }: DataParameters) => {
    setLoading(true)
    // @ts-ignore
    fetch("https://610c27d566dd8f0017b76cea.mockapi.io/api/v1/articles?" + getQueryString({
      page: page,
      limit: rowsPerPage,
      sortBy: sortField,
      order: sortDirection
    }), {
      method: "GET",
      headers: {
        // @ts-ignore
        "Accept": "application/json"
      }
    }).then(results => results.json())
      .then(data => {
        setData(data)
        setLoading(false)
      } );

  }, []);

  console.log(data);

  const dataObject = useMemo(() => ({
    rows: data,
    pagination: {
      totalRowsCount: 85
    }
  }), [data])



  return <BackendPaginatedTable
    loading={loading}
    classes={{
      tableBody: {
        root: classes.testBackground
      }
    }}
    defaultPage={1} itemToRow={itemToRow}
                                data={dataObject} headCells={headCells} fetch={fetchCallback} />;
};

export default App;
