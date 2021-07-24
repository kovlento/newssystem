import React, { useState, useEffect, useRef } from 'react'
import { message, PageHeader } from 'antd'
import { Steps, Button, Form, Input, Select, notification } from 'antd'
import style from './News.module.scss'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor'

const { Step } = Steps
const { Option } = Select
export default function NewsUpdate(props) {
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')

  const handleNext = () => {
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          setFormInfo(res)
          setCurrent(current + 1)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      if (content === '' || content.trim() === '<p></p>') {
        message.error('请输入内容！')
      } else {
        setCurrent(current + 1)
      }
    }
  }
  const handlePrev = () => {
    setCurrent(current - 1)
  }

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
  }

  const NewsForm = useRef(null)

  useEffect(() => {
    axios.get('/categories').then((res) => {
      setCategoryList(res.data)
    })
  }, [])

  useEffect(() => {
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        const { title, categoryId, content } = res.data
        NewsForm.current.setFieldsValue({
          title,
          categoryId,
        })
        setContent(content)
      })
  }, [props.match.params.id])

  const handleSave = (auditState) => {
    axios
      .patch(`/news/${props.match.params.id}`, {
        ...formInfo,
        content,
        auditState: auditState,
      })
      .then((res) => {
        props.history.push(
          auditState === 0 ? '/news-manage/draft' : '/audit-manage/list'
        )
        notification.info({
          message: '通知',
          description: `您可以到${
            auditState === 0 ? '草稿箱' : '审核列表'
          }中查看您的新闻`,
          placement: 'bottomRight',
        })
      })
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="更新新闻"
        onBack={() => props.history.goBack()}
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      <div style={{ marginTop: '50px' }}>
        <div className={current === 0 ? '' : style.hidden}>
          <Form {...layout} name="normal_news" ref={NewsForm}>
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: '不能为空！' }]}
            >
              <Input placeholder="新闻标题" />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: '不能为空！' }]}
            >
              <Select>
                {categoryList.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className={current === 1 ? '' : style.hidden}>
        <NewsEditor
          getContent={(value) => {
            setContent(value)
          }}
          content={content}
        ></NewsEditor>
      </div>
      <div className={current === 2 ? '' : style.hidden}></div>

      <div style={{ marginTop: '50px' }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
        {current > 0 && <Button onClick={handlePrev}>上一步</Button>}
      </div>
    </div>
  )
}
