import * as React from 'react';
import './style'
interface city {
  cityName: string
}
class Header extends React.Component<city> {
  render() {
    console.log(this.props)
    return (
      <div id="home-header" className="clear-fix">
        <div className="home-header-left float-left">
          <span>{this.props.cityName}</span>
        </div>
        <div className="home-header-right float-right">
          <div className="selfOutline"></div>
        </div>
        <div className="home-header-middle">
          <div className="search-container">
            <i className="icon-search"></i>
            <input type="text" placeholder="请输入关键字" />
          </div>
        </div>
      </div>
    )
  }
}


export default Header

