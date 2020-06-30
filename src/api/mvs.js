import request from '../utils/request'
// mv地址
export const allMvs = ({ area, order, type, offset, limit }) => {
  return request({
    url: '/mv/all',
    method: 'get',
    params: {
      limit,
      area,
      order,
      type,
      offset,
    },
  })
}
