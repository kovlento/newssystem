import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import {
  UserOutlined,
  HomeOutlined,
  LockOutlined,
  ReadOutlined,
  HighlightOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

import './index.scss'

const { Sider } = Layout
const { SubMenu } = Menu

const iconList = {
  '/home': <HomeOutlined />,
  '/user-manage': <UserOutlined />,
  '/user-manage/list': <UserOutlined />,
  '/right-manage': <LockOutlined />,
  '/right-manage/role/list': <LockOutlined />,
  '/right-manage/right/list': <LockOutlined />,
  '/news-manage': <ReadOutlined />,
  '/news-manage/add': <ReadOutlined />,
  '/news-manage/draft': <ReadOutlined />,
  '/news-manage/category': <ReadOutlined />,
  '/audit-manage': <HighlightOutlined />,
  '/audit-manage/audit': <HighlightOutlined />,
  '/audit-manage/list': <HighlightOutlined />,
  '/publish-manage': <SendOutlined />,
  '/publish-manage/unpublished': <SendOutlined />,
  '/publish-manage/published': <SendOutlined />,
  '/publish-manage/sunset': <SendOutlined />,
}

function SideMenu(props) {
  const [menu, setMenu] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then((res) => {
      setMenu(res.data)
    })
  }, [])

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem('token'))

  const checkPagePermission = (item) => {
    return item.pagepermisson === 1 && rights.includes(item.key)
  }

  const renderMenu = (menuList) => {
    return menuList.map((item) => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return (
          <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        )
      }
      return (
        checkPagePermission(item) && (
          <Menu.Item
            key={item.key}
            icon={iconList[item.key]}
            onClick={() => {
              props.history.push(item.key)
            }}
          >
            {item.title}
          </Menu.Item>
        )
      )
    })
  }

  const selectedKey = [props.location.pathname]
  const openKey = ['/' + props.location.pathname.split('/')[1]]

  return (
    <Sider trigger={null} collapsible>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div className="logo">全球新闻发布管理系统</div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKey}
            defaultOpenKeys={openKey}
          >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

export default withRouter(SideMenu)
