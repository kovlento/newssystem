import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import { Button } from 'antd'

export default function Published() {
  // 2 === 已发布
  const { dataSource, handleSunset } = usePublish(2)

  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button type="primary" onClick={() => handleSunset(id)}>
            下线
          </Button>
        )}
      ></NewsPublish>
    </div>
  )
}
