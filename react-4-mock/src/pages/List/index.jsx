import React from 'react';
import { get } from '$src/fetch'
export default class List extends React.Component {
  componentDidMount() {
    this.loadFirstPageDate()
  }
  loadFirstPageDate() {
    const result = get('/api/list');
    console.log(result)
  }
  render() {
    return <section>List</section>;
  }
}
