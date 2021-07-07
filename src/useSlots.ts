import React from 'react'
import TableEmpty from './components/slots/TableEmpty'
import TableHead from './components/slots/TableHead'
import TablePagination from './components/slots/TablePagination'
// eslint-disable-next-line no-unused-vars
import { Slots, XTableProps } from './types'

type Props = {
  children?: XTableProps<Object>['children']
}

const useSlots = <DataType extends Object>({ children }: Props) => {
  return React.useMemo<Slots<DataType>>(() => {
    const slots: Slots<DataType> = {}

    if (typeof children === 'undefined') {
      return slots
    }

    React.Children.forEach(children, (child) => {
      if (child && React.isValidElement(child)) {
        // @ts-ignore
        if ((child as React.ReactElement).type === TablePagination) {
          slots.TablePagination = child.props.children
        }

        // @ts-ignore
        if ((child as React.ReactElement).type === TableHead) {
          slots.TablePagination = child.props.children
        }

        // @ts-ignore
        if ((child as React.ReactElement).type === TableEmpty) {
          slots.TableEmpty = child.props.children
        }
      }
    })

    return slots
  }, [children])
}

export default useSlots
