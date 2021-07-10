import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, message, Switch } from 'antd'
import axios from 'axios'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'

const { confirm } = Modal

export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [regionList, setRegionList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [visible, setVisible] = useState(false)
  const [updateVisible, setUpdateVisible] = useState(false)
  const [isUpdateDisable, setIsUpdateDisable] = useState(false)
  const [updateCurrent, setUpdateCurrent] = useState(null)
  const addForm = useRef(null)
  const updateForm = useRef(null)

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value,
        })),
        {
          text: '全球',
          value: '全球',
        },
      ],
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === ''
        } else {
          return item.region === value
        }
      },
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => {
              handleChange(item)
            }}
          />
        )
      },
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
              onClick={() => handleUpdate(item)}
              disabled={item.default}
            />
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleConfirm(item)}
              disabled={item.default}
            />
          </div>
        )
      },
    },
  ]

  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    const roleObj = {
      1: 'superadmin',
      2: 'admin',
      3: 'editor',
    }
    axios.get('/users?_expand=role').then((res) => {
      const list = res.data
      setDataSource(
        roleObj[roleId] === 'superadmin'
          ? list
          : [
              ...list.filter((item) => item.username === username),
              ...list.filter(
                (item) =>
                  item.region === region && roleObj[item.roleId] === 'editor'
              ),
            ]
      )
    })
  }, [roleId, region, username])

  useEffect(() => {
    axios.get('/regions').then((res) => {
      setRegionList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('/roles').then((res) => {
      setRoleList(res.data)
    })
  }, [])

  const handleChange = (item) => {
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios
      .patch(`/users/${item.id}`, {
        roleState: item.roleState,
      })
      .then(() => {
        message.success('修改成功！')
      })
  }

  const handleUpdate = (item) => {
    setTimeout(() => {
      setUpdateVisible(true)
      if (item.roleId === 1) {
        setIsUpdateDisable(true)
      } else {
        setIsUpdateDisable(false)
      }
      updateForm.current.setFieldsValue(item)
    }, 0)
    setUpdateCurrent(item)
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
    axios.delete(`/users/${item.id}`).then((res) => {
      message.success('删除成功！')
    })
  }

  const addClick = () => {
    setVisible(true)
  }
  const onOk = () => {
    addForm.current
      .validateFields()
      .then((value) => {
        setVisible(false)
        addForm.current.resetFields()
        axios
          .post(`/users`, {
            ...value,
            roleState: true,
            default: false,
          })
          .then((res) => {
            setDataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter((item) => item.id === value.roleId)[0],
              },
            ])
            message.success('添加成功！')
          })
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const updateOk = () => {
    updateForm.current
      .validateFields()
      .then((value) => {
        setUpdateVisible(false)
        setDataSource(
          dataSource.map((item) => {
            if (item.id === updateCurrent.id) {
              return {
                ...item,
                ...value,
                role: roleList.filter((data) => data.id === value.roleId)[0],
              }
            }
            return item
          })
        )
        setIsUpdateDisable(!isUpdateDisable)
        axios.patch(`/users/${updateCurrent.id}`, value).then((res) => {
          message.success('更新成功！')
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div>
      <Button type="primary" onClick={addClick}>
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        visible={visible}
        title="添加用户"
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setVisible(false)
        }}
        onOk={onOk}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={addForm}
        ></UserForm>
      </Modal>
      <Modal
        visible={updateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setUpdateVisible(false)
          setIsUpdateDisable(!isUpdateDisable)
        }}
        onOk={updateOk}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={updateForm}
          isUpdateDisable={isUpdateDisable}
          isUpdate={true}
        ></UserForm>
      </Modal>
    </div>
  )
}
