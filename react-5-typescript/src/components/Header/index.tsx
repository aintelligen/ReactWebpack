import * as React from 'react';
import PropTypes from 'prop-types'
import './header'
import { connect } from 'react-redux'
interface themeC {
  themeColor: string
}
class Header extends React.Component<themeC> {
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
function mapDispatchToProps() {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)

