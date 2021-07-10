import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, message, Popover, Switch } from 'antd'
import axios from 'axios'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const { confirm } = Modal

export default function RightList() {
  const [dataSource, setDataSource] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      },
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      },
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Popover
              content={
                <div style={{ textAlign: 'center' }}>
                  <Switch
                    checked={item.pagepermisson}
                    onChange={() => handleSwitch(item)}
                  ></Switch>
                </div>
              }
              title="页面配置项"
              trigger={item.pagepermisson === undefined ? '' : 'click'}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined}
              />
            </Popover>
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleConfirm(item)}
            />
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    axios.get('/rights?_embed=children').then((res) => {
      const list = res.data
      list.forEach((item) => {
        if (item.children.length === 0) {
          item.children = ''
        }
      })
      setDataSource(list)
    })
  }, [])

  const handleSwitch = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])
    if (item.grade === 1) {
      axios
        .patch(`/rights/${item.id}`, {
          pagepermisson: item.pagepermisson,
        })
        .then((res) => {
          message.success('修改成功！')
        })
    } else if (item.grade === 2) {
      axios
        .patch(`/children/${item.id}`, {
          pagepermisson: item.pagepermisson,
        })
        .then((res) => {
          message.success('修改成功！')
        })
    }
  }

  const handleConfirm = (item) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        deleteOk(item)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const deleteOk = (item) => {
    console.log(item)
    if (item.grade === 1) {
      setDataSource(dataSource.filter((data) => data.id !== item.id))
      axios.delete(`/rights/${item.id}`).then((res) => {
        message.success('删除成功！')
      })
    } else if (item.grade === 2) {
      let list = dataSource.filter((data) => data.id === item.rightId)
      list[0].children = list[0].children.filter((data) => data.id !== item.id)
      setDataSource([...dataSource])
      axios.delete(`/children/${item.id}`).then((res) => {
        message.success('删除成功！')
      })
    }
  }

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  )
}
