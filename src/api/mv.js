import request from '../utils/request'

// mv地址
export const mvUrl = ({ id }) => {
  return request({
    url: '/mv/url',
    method: 'get',
    params: {
      id,
    },
  })
}
// 相似mv
export const simiMV = ({ mvid }) => {
  return request({
    url: '/simi/mv',
    method: 'get',
    params: {
      mvid,
    },
  })
}
// mv详情
export const mvDetail = ({ mvid }) => {
  return request({
    url: '/mv/detail',
    method: 'get',
    params: {
      mvid,
    },
  })
}
// 歌手信息
export const artistInfo = ({ artistId }) => {
  return request({
    url: '/artists',
    method: 'get',
    params: {
      id: artistId,
    },
  })
}
// 热门评论
export const hotComments = ({ id }) => {
  return request({
    url: '/comment/hot',
    method: 'get',
    params: {
      id,
      type: 1,
    },
  })
}

// 最新评论
export const newComments = ({ id, limit, offset }) => {
  return request({
    url: '/comment/mv',
    method: 'get',
    params: {
      id,
      limit,
      offset,
    },
  })
}
