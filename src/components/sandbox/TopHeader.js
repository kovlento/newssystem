import React from 'react'
import { Layout, Menu, Dropdown, Avatar } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

const { Header } = Layout

const TopHeader = (props) => {
  const changeCollapsed = () => {
    props.changeCollapsed()
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
      {props.isCollapsed ? (
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

const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed,
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: 'change_collapsed',
    }
  },
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TopHeader))
