import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import Home from './home/Home'
import UserList from './user-manage/UserList'
import RoleList from './auth-manage/RoleList'
import AuthList from './auth-manage/AuthList'
import NoPermission from './nopermission/NoPermission'

import { Layout } from 'antd'
import './SandBox.css'

const { Content } = Layout

export default function SandBox() {
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>

        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/user-manage/list" component={UserList} />
            <Route path="/auth-manage/role/list" component={RoleList} />
            <Route path="/auth-manage/auth/list" component={AuthList} />
            <Redirect from="/" to="/home" exact />
            <Route path="*" component={NoPermission} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}
