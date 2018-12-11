import React from 'react';
import PropTypes from 'prop-types'
import './header'
// import { connect } from '$src/redux';
import { connect } from 'react-redux'

class Header extends React.Component {
  static contextTypes = {
    store: PropTypes.object
  }
  render() {
    return (
      <div className="header-wrap">
        <h2 style={{ color: this.props.themeColor }}>React app SSR</h2>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}

export default connect(mapStateToProps)(Header)

