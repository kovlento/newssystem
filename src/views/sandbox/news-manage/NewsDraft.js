import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, message, notification } from 'antd'
import axios from 'axios'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons'

const { confirm } = Modal

export default function NewsDraft(props) {
  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios
      .get(`/news?author=${username}&auditState=0&_expand=category`)
      .then((res) => {
        setDataSource(res.data)
      })
  }, [username])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      },
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      },
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleConfirm(item)}
            />
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                props.history.push(`/news-manage/update/${item.id}`)
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<ArrowUpOutlined />}
              onClick={() => handleCheck(item.id)}
            />
          </div>
        )
      },
    },
  ]

  const handleCheck = (id) => {
    axios
      .patch(`/news/${id}`, {
        auditState: 1,
      })
      .then((res) => {
        props.history.push('/audit-manage/list')
        notification.info({
          message: '通知',
          description: `您可以到${'审核列表'}中查看您的新闻`,
          placement: 'bottomRight',
        })
      })
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
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    axios.delete(`/news/${item.id}`).then((res) => {
      message.success('删除成功！')
    })
  }

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </div>
  )
}
