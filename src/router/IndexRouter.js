import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from '../views/login/Login'
import Detail from '../views/news/Detail'
import News from '../views/news/News'
import SandBox from '../views/sandbox/SandBox'

export default function indexRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/news" component={News} />
        <Route path="/detail/:id" component={Detail} />
        {/* <Route path="/" component={SandBox} /> */}
        <Route
          path="/"
          render={() =>
            localStorage.getItem('token') ? (
              <SandBox></SandBox>
            ) : (
              <Redirect to="/login/" />
            )
          }
        />
      </Switch>
    </HashRouter>
  )
}
