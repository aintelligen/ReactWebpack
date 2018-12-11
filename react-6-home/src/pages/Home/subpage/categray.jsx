import React from 'react';
import ReactSwipe from 'react-swipe';
import './categray.less'
import { get } from '$src/fetch'

class PageList extends React.Component {
  constructor(state, context) {
    super(state, context)
  }
  render() {
    return (
      <ul className="clear-fix">
        {this.props.list.map((v, k) => {
          return <li className="float-left" key={k}><img src={v.src} alt="" /> <br /> {v.text} </li>
        })}
      </ul>
    )
  }
}

export default class Categray extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      index: 0,
      list: []
    }
  }
  componentWillMount() {
    this.loadList();
  }
  async loadList() {
    let res = await get('/api/home/categray');
    this.resultHandle(res);
  }
  resultHandle(result) {
    if (result.status == 200) {
      this.setState({
        list: result.data
      })
    }
  }
  render() {
    const opt = {
      callback: function (index) {
        this.setState({
          index: index
        })
      }.bind(this)
    }
    return (
      <section id="home-category">
        <ReactSwipe swipeOptions={opt}>
          <div className="carousel-item">
            <PageList list={this.state.list.slice(0, 10)}></PageList>
          </div>
          <div className="carousel-item">
            <PageList list={this.state.list.slice(10, 20)}></PageList>
          </div>
          <div className="carousel-item">
            <PageList list={this.state.list.slice(20, 30)}></PageList>
          </div>
        </ReactSwipe>
        <div className="index-container">
          <ul>
            <li className={this.state.index === 0 ? "selected" : ''}></li>
            <li className={this.state.index === 1 ? "selected" : ''}></li>
            <li className={this.state.index === 2 ? "selected" : ''}></li>
          </ul>
        </div>
      </section>
    )
  }
}









