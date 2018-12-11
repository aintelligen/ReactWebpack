import React from 'react';
import Header from '$components/Header';
import Categray from './subpage/categray.jsx'
import { connect } from 'react-redux'
class Home extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    return (
      <div>
        <Header cityName={this.props.userinfo.cityName} />
        <Categray></Categray>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    userinfo: state.userinfo
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)






