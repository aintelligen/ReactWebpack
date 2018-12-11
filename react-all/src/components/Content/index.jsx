import React from 'react';
import PropTypes from 'prop-types'
import './content'
import { connect } from 'react-redux';
class Content extends React.Component {
  static contextTypes = {
    store: PropTypes.object
  }
  render() {
    return (
      <div className="content-wrap">
        <div>content</div>
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
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Content)