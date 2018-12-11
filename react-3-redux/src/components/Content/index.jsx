import React from 'react';
import PropTypes from 'prop-types'
import './content'
import logo from './img/logo'
// import { connect } from '$src/redux';
import { connect } from 'react-redux';
class Content extends React.Component {
  static contextTypes = {
    store: PropTypes.object
  }

  handleSwitchColor(color) {
    if (this.props.onSwitchColor) {
      this.props.onSwitchColor(color)
    }
  }
  render() {
    return (
      <div className="content-wrap">
        <hr />
        <div style={{ color: this.props.themeColor }}>content</div>
        <img src={logo} alt="" />
        <br />
        <button onClick={this.handleSwitchColor.bind(this, 'blue')}>blue</button><br />
        <button onClick={this.handleSwitchColor.bind(this, '#333')}>black</button><br />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onSwitchColor: (color) => {
      dispatch({ type: 'CHANGE_COLOR', themeColor: color })
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Content)