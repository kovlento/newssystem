import React, { useState } from 'react'
import { Layout, Menu, Dropdown, Avatar } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { withRouter } from 'react-router-dom'

const { Header } = Layout

const TopHeader = (props) => {
  const [collapsed, setCollapsed] = useState(false)

  const changeCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem('token'))

  const menu = (
    <Menu>
      <Menu.Item>{roleName}</Menu.Item>
      <Menu.Item
        danger
        onClick={() => {
          localStorage.removeItem('token')
          props.history.replace('/login')
        }}
      >
        退出
      </Menu.Item>
    </Menu>
  )

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {collapsed ? (
        <MenuUnfoldOutlined onClick={changeCollapsed} />
      ) : (
        <MenuFoldOutlined onClick={changeCollapsed} />
      )}
      <div style={{ float: 'right' }}>
        <span>
          欢迎 <b style={{ color: '#1890ff' }}>{username}</b>
        </span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

export default withRouter(TopHeader)
