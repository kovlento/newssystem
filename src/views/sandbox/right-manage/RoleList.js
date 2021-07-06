import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, message, Tree } from 'antd'
import axios from 'axios'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const { confirm } = Modal

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [currentList, setCurrentList] = useState([])
  const [currentId, setCurrentId] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setIsModalVisible(true)
                setCurrentList(item.rights)
                setCurrentId(item.id)
              }}
            />
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
    axios.get('http://localhost:5000/roles').then((res) => {
      setDataSource(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then((res) => {
      setRightList(res.data)
    })
  }, [])

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
    axios.delete(`http://localhost:5000/roles/${item.id}`).then((res) => {
      message.success('删除成功！')
    })
  }

  const handleOk = () => {
    setIsModalVisible(false)
    setDataSource(
      dataSource.map((item) => {
        if (item.id === currentId) {
          return { ...item, rights: currentList }
        }
        return item
      })
    )
    axios
      .patch(`http://localhost:5000/roles/${currentId}`, {
        rights: currentList,
      })
      .then((res) => {
        message.success('修改成功！')
      })
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const onCheck = (item) => {
    setCurrentList(item.checked)
  }

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title="权限分配"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <Tree
          checkable
          checkedKeys={currentList}
          checkStrictly={true}
          onCheck={onCheck}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
