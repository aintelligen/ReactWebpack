import React from 'react'
import {
  BrowserRouter,
  Route,
  Redirect,
  NavLink,
  Switch
} from 'react-router-dom'
import './router'
import Home from '../pages/Home';
import List from '../pages/List';
import Detail from '../pages/Detail';
import NotFound from '../pages/NotFound';

const routeMap = [
  {
    path: '/',
    to: '/home',
    exact: true,
    component: Home
  },
  {
    exact: true,
    path: '/home',
    component: Home
  },
  {
    path: '/list',
    component: List
  },
  {
    path: '/detail',
    component: Detail
  },
  {
    path: '*',
    component: NotFound
  },
]

const routeLink = [
  {
    exact: true,
    active: 'nav_active',
    to: '/home',
    text: 'Home'
  },
  {
    to: '/list',
    active: 'nav_active',
    text: 'List'
  },
  {
    to: '/detail',
    active: 'nav_active',
    text: 'Detail'
  },
]

export default class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <section>
          {/* <div className="nav-wrapper">
            {
              routeLink.map((item, index) => {
                return <NavLink activeClassName={item.active} key={index} className="nav-link" exact={item.exact} to={item.to}>{item.text}</NavLink>
              })
            }
          </div> */}
          <Switch>
            {
              routeMap.map((item, index) => {
                if (item.to) {
                  return <Redirect exact={item.exact} key={index} path={item.path} to={item.to} />
                } else {
                  return <Route exact={item.exact} key={index} path={item.path} component={item.component} />
                }
              })
            }
          </Switch>
        </section>
      </BrowserRouter>
    )
  }
}

