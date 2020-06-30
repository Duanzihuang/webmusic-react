import request from '../utils/request'
// 精品歌单
export const highquality = ({ cat }) => {
  return request({
    url: '/top/playlist/highquality',
    method: 'get',
    params: {
      limit: 1,
      cat,
    },
  })
}
// 精选歌单
export const topList = ({ cat, offset }) => {
  return request({
    url: '/top/playlist',
    method: 'get',
    params: {
      limit: 10,
      offset,
      cat,
    },
  })
}
