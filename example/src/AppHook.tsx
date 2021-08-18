import { useCallback} from "react";
import { ItemToRow } from "../../dist/types";

import { DataParameters,useBackendPaginatedTable } from "@pcihecklist/react-x-table";
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
const AppHook = () => {

  const classes = useStyles()
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


  const fetchCallback = useCallback(async ({ page, rowsPerPage, sortDirection, sortField }: DataParameters) => {
    console.log(page, rowsPerPage, "log")
    // @ts-ignore
    const response = await fetch("https://610c27d566dd8f0017b76cea.mockapi.io/api/v1/articles?" + getQueryString({
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
    });

    const json = await response.json();

    return {
      rows: json,
      pagination: {
        totalRowsCount: 85
      }
    };

  }, []);




  const table = useBackendPaginatedTable<DataType, {}>({
    fetch: fetchCallback,
    useCache: true,
    headCells,
    itemToRow,
    classes: {
      tableBody: {
        root: classes.testBackground
      }
    }
  })

  return table
};

export default AppHook;
