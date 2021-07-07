import React from 'react'
// @ts-ignore
// eslint-disable-next-line no-unused-vars
import type { XTableProps } from '../../types'

type RenderProps<ObjectType> = {
  emptyErrorMessage: XTableProps<ObjectType>['emptyErrorMessage']
  loading: XTableProps<ObjectType>['loading']
}

export type TableEmptyRenderProps<ObjectType> = (
  renderProps: RenderProps<ObjectType>
) => JSX.Element | JSX.Element[]

type Props<ObjectType extends Object> = {
  children: TableEmptyRenderProps<ObjectType>
}

const TableEmpty = <ObjectType extends Object>({
  children
}: Props<ObjectType>) => {
  return <React.Fragment>{children}</React.Fragment>
}

export default TableEmpty
