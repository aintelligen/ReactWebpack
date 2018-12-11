import * as React from 'react'

export interface ListProps {
  compiler?: string;
  framework?: string;
}

export default class List extends React.Component<ListProps, {}>{
  render() {
    return <div>typescript list</div>
  }
}
