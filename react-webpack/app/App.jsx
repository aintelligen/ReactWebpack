import React from 'react'

export default class App extends React.Component {
  componentWillMount() {
    this.init()
  }
  init() {
    console.log('async function')
  }
  render() {
    return (
      <div>App</div>
    )
  }
}