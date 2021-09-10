import React, { useState, useEffect, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd'
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import * as Echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card

export default function Home() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [allList, setAllList] = useState([])
  const [pieChart, setPieChart] = useState(null)
  const [visible, setVisible] = useState(false)
  const barRef = useRef()
  const pieRef = useRef()

  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`
      )
      .then((res) => {
        setViewList(res.data)
      })
  }, [])

  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`
      )
      .then((res) => {
        setStarList(res.data)
      })
  }, [])

  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then((res) => {
      renderBarView(_.groupBy(res.data, (item) => item.category.title))
      setAllList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])

  const renderBarView = (obj) => {
    var myChart = Echarts.init(barRef.current)
    const numData = Object.values(obj)
    let maxY = 0
    numData.forEach((item) => {
      maxY = item.length > maxY ? item.length : maxY
    })
    var option = {
      title: {
        text: '新闻分类图示',
      },
      tooltip: {},
      legend: {
        data: ['文章数量'],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0,
        },
      },
      yAxis: {
        minInterval: 1,
        max: maxY + 10,
        interval: 5,
      },
      series: [
        {
          name: '文章数量',
          type: 'bar',
          data: numData.map((item) => item.length),
        },
      ],
    }
    myChart.setOption(option)

    window.onresize = () => {
      myChart.resize()
    }
  }

  const renderPieView = (obj) => {
    let currentList = allList.filter((item) => item.author === username)
    let groupObj = _.groupBy(currentList, (item) => item.category.title)

    let list = []
    for (const i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length,
      })
    }

    let myChart
    if (!pieChart) {
      myChart = Echarts.init(pieRef.current)
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }
    let option
    option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }

    option && myChart.setOption(option)
  }

  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem('token'))

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  setTimeout(() => {
                    setVisible(true)
                    renderPieView()
                  }, 0)
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{ paddingLeft: '30px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        width="800px"
        title="个人新闻分类"
        placement="right"
        onClose={() => {
          setVisible(false)
        }}
        visible={visible}
      >
        <div
          ref={pieRef}
          style={{
            width: '100%',
            height: '400px',
            marginTop: '30px',
          }}
        ></div>
      </Drawer>
      <div
        ref={barRef}
        style={{
          width: '100%',
          height: '400px',
          marginTop: '30px',
        }}
      ></div>
    </div>
  )
}
