import React from 'react';
import './content'
const logo = require('./images/logo')
export default class Content extends React.Component {
  render() {
    return (
      <div class="content-wrap">
        <div class="content-logo"><img src={logo} alt="" /></div>
      </div>
    )
  }
}