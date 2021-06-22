import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from '../views/login/Login'
import SandBox from '../views/sandbox/SandBox'

export default function indexRouter() {
  const token = localStorage.getItem('token')
  console.log(token)
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        {/* <Route path="/" component={SandBox} /> */}
        <Route
          path="/"
          render={() =>
            token ? <SandBox></SandBox> : <Redirect to="/login/" />
          }
        />
      </Switch>
    </HashRouter>
  )
}
