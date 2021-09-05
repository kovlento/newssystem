import { useState, useEffect } from 'react'
import { message } from 'antd'
import axios from 'axios'

function usePublish(type) {
  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios
      .get(`/news?author=${username}&publishState=${type}&_expand=category`)
      .then((res) => {
        setDataSource(res.data)
      })
  }, [username, type])

  const handlePublish = (id) => {
    setDataSource(dataSource.filter((item) => item.id !== id))
    axios
      .patch(`/news/${id}`, { publishState: 2, publishTime: Date.now() })
      .then((res) => {
        message.success('发布成功！')
      })
  }
  const handleSunset = (id) => {
    setDataSource(dataSource.filter((item) => item.id !== id))
    axios.patch(`/news/${id}`, { publishState: 3 }).then((res) => {
      message.success('下线成功！')
    })
  }
  const handleDelete = (id) => {
    setDataSource(dataSource.filter((item) => item.id !== id))
    axios.delete(`/news/${id}`).then((res) => {
      message.success('删除成功！')
    })
  }

  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete,
  }
}

export default usePublish
