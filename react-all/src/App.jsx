import React from 'react'
import Routes from './router'
import { connect } from 'react-redux'
import { CITYNAME } from './utils/localstore'
import { update } from './actions/userinfo'

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      initDone: false
    }
  }
  componentDidMount() {
    let cityName = localStorage.getItem(CITYNAME);
    if (!cityName) {
      cityName = '北京';
    }
    this.props.userInfoAction({
      cityName
    })
    this.setState({
      initDone: true
    })
  }
  render() {
    return (
      this.state.initDone ? <Routes></Routes> : <div>正在加载...</div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}
function mapDispatchToProps(dispatch) {
  return {
    userInfoAction: (cityName) => { dispatch(update(cityName)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)





