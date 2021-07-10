import React, { useEffect, useState } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import axios from '_axios@0.21.1@axios'

const LocalRouterMap = {
  '/home': Home,
  '/user-manage/list': UserList,
  '/right-manage/role/list': RoleList,
  '/right-manage/right/list': RightList,
  '/news-manage/add': NewsAdd,
  '/news-manage/draft': NewsDraft,
  '/news-manage/category': NewsCategory,
  '/audit-manage/audit': Audit,
  '/audit-manage/list': AuditList,
  '/publish-manage/unpublished': Unpublished,
  '/publish-manage/published': Published,
  '/publish-manage/sunset': Sunset,
}

export default function NewsRouter() {
  const [backRouterList, setBackRouterList] = useState([])
  useEffect(() => {
    Promise.all([axios.get('/rights'), axios.get('/children')]).then((res) => {
      setBackRouterList([...res[0].data, ...res[1].data])
    })
  }, [])

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem('token'))

  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && item.pagepermisson === 1
  }
  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }

  return (
    <div>
      <Switch>
        {backRouterList.map((item) => {
          if (checkRoute(item) && checkUserPermission(item)) {
            return (
              <Route
                path={item.key}
                key={item.key}
                component={LocalRouterMap[item.key]}
                exact
              />
            )
          } else {
            return null
          }
        })}
        <Redirect from="/" to="/home" exact />
        {backRouterList.length > 0 && (
          <Route path="*" component={NoPermission} />
        )}
      </Switch>
    </div>
  )
}