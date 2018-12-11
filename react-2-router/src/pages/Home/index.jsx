import React from 'react';
import Header from '$components/Header'
import Content from '$components/Content'


export default class Home extends React.Component {
  render() {
    return (
      <section>
        Home
        <Header></Header>
        <Content></Content>
      </section>
    )
  }
}