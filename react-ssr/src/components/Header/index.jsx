import React from 'react';
import './header'
const logo = require('./images/logo')
export default class Header extends React.Component {
  render() {
    return (
      <div class="header-wrap">
        <h2>React app SSR</h2>
      </div>
    )
  }
}