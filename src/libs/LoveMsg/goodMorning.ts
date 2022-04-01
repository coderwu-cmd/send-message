/**
 * @name goodMorning
 * @description 说早安
 */
import { json } from 'node:stream/consumers'
import API from '../../api/loveMsg'
import { getConfig } from '../../utils/getConfig'
import { wxNotify } from '../WxNotify'
import { textTemplate } from './templates/text'
import { textCardTemplate } from './templates/textcard'
import axios from 'axios'

const CONFIG = getConfig().loveMsg

// 美丽短句
/* const goodWord = async () => {
  try {
    // 并行请求，优响相应
    const dataSource = await Promise.allSettled([
      API.getSaylove(), // 土味情话
      API.getCaihongpi(), // 彩虹屁
      API.getOneWord(), // 一言
      API.getSongLyrics(), // 最美宋词
      API.getOneMagazines(), // one杂志
      API.getNetEaseCloud(), // 网易云热评
      API.getDayEnglish(), // 每日英语
    ])

    // 过滤掉异常数据
    const [sayLove, caiHongpi, oneWord, songLyrics, oneMagazines, netEaseCloud, dayEnglish] =
      dataSource.map((n) => (n.status === 'fulfilled' ? n.value : null))

    // 对象写法
    const data: any = {
      sayLove,
      caiHongpi,
      oneWord,
      songLyrics,
      oneMagazines,
      netEaseCloud,
      dayEnglish,
    }

    const template = textTemplate(data)
    console.log('goodWord', template)

    wxNotify(template)
  } catch (error) {
    console.log('goodWord:err', error)
  }
} */

// 天气信息
const weatherInfo = async () => {
  try {
    const weather = await API.getWeather(CONFIG.city_name)
    if (weather) {
      const lunarInfo = await API.getLunarDate(weather.date)
      const template = textCardTemplate({ ...weather, lunarInfo })
      console.log('weatherInfo', template)
      // 发送消息
      await wxNotify({
        msgtype: 'text',
        text: {
          content: `${JSON.stringify(weather)}, ${JSON.stringify(lunarInfo)}`
        }
      })
    } else {
      // 发送消息
      await wxNotify({
        msgtype: 'text',
        text: {
          content: `weather: ${JSON.stringify(weather)}, city_name: ${JSON.stringify(CONFIG.city_name)}`
        }
      })
      axios({
        method: 'get',
        url: 'http://api.tianapi.com/tianqi/index',
        params: {
          key: '760dc284d866d4e34ab31e3bd437505c',
          city: '武汉'
        }
      }).then( async res => {
        await wxNotify({
          msgtype: 'text',
          text: {
            content: `${JSON.stringify(res.data.newslist)}`
          }
        })
      })
    }
  } catch (error) {
    console.log('weatherInfo:err', error)
  }
}

// const format = () => {
//   const timer = new Date()
//   const year = timer.getFullYear()
//   const month = timer.getMonth() + 1
//   const date = timer.getDate()
//   const hour = String(timer.getHours()).padStart(2, '0')
//   const minute = String(timer.getMinutes()).padStart(2, '0')
//   return `${year}年${month}月${date}日 ${hour}点${minute}分`
// }

const sendMessage = async () => {
  const content = '记得打卡哟'
  await wxNotify({
    msgtype: 'text',
    text: {
      content
    }
  })
}
// goodMorning
export const goodMorning = async () => {
  await sendMessage()
  // await goodWord()
  await weatherInfo()
}
