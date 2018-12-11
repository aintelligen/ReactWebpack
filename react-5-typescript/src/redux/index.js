
/* 
const mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
} 

const mapDispatchToProps = (dispatch) =>{
  return {
    onSwitchColor: (color)=>{
      dispatch({type: 'CHANGE_COLOR', themeColor: color})
    }
  }
}

*/

import React, { Component } from 'react'
import PropTypes from 'prop-types'

const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
  class Connect extends Component {
    static contextTypes = {
      store: PropTypes.object
    }
    constructor() {
      super()
      this.state = {
        allProps: {}
      }
    }
    componentWillMount() {
      const { store } = this.context
      this.updateProps()
      store.subscribe(() => this.updateProps())
    }
    updateProps() {
      const { store } = this.context
      let stateProps = mapStateToProps ? mapStateToProps(store.getState(), this.props) : {};
      let dispatchProps = mapDispatchToProps ? mapDispatchToProps(store.dispatch, this.props) : {}
      this.setState({
        allProps: {
          ...stateProps,
          ...dispatchProps,
          ...this.props
        }
      })
    }
    render() {
      // {...stateProps} 意思是把从store里面所需要的属性拿出来全部通过 `props` 方式传递进去
      return <WrappedComponent {...this.state.allProps} />
    }
  }
  return Connect
}

class Provider extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    children: PropTypes.any
  }

  static childContextTypes = {
    store: PropTypes.object
  }
  getChildContext() {
    return {
      store: this.props.store
    }
  }
  render() {
    return (
      <div>{this.props.children}</div>
    )
  }
}

export {
  connect,
  Provider
}