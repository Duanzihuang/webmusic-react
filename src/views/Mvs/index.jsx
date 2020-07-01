import React, { Component } from 'react'
import { Pagination } from 'antd'
import { allMvs } from '../../api/mvs'
import { formatCount } from '../../utils/format'

export default class Mvs extends Component {
  constructor() {
    super()

    this.state = {
      // 区域列表
      areas: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
      // 选中区域的索引
      areaIndex: 0,
      // 类型列表
      types: ['全部', '官方版', '原声', '现场版', '网易出品'],
      // 类型选中索引
      typeIndex: 0,
      // 排序列表
      orders: ['上升最快', '最热', '最新'],
      // 排序选中索引
      orderIndex: 0,
      // 每页数据
      limit: 12,
      // 页码
      page: 1,
      // 总条数
      total: 0,
      // mv列表数据
      mvList: [],
    }
  }

  componentDidMount() {
    this.getMvListData()
  }

  async getMvListData() {
    const {
      areas,
      areaIndex,
      types,
      typeIndex,
      orders,
      orderIndex,
      page,
      total,
    } = this.state

    const res = await allMvs({
      area: areas[areaIndex],
      type: types[typeIndex],
      order: orders[orderIndex],
      offset: (page - 1) * 12,
      limit: 12,
    })

    if (res.data.code === 200) {
      this.setState({
        mvList: res.data.data,
        total: res.data.count || total,
      })
    }
  }

  renderCondition = () => {
    const {
      areas,
      areaIndex,
      types,
      typeIndex,
      orders,
      orderIndex,
    } = this.state
    return (
      <div className="filter-wrap">
        <div className="seciton-wrap">
          <span className="section-type">地区:</span>
          <ul className="tabs-wrap">
            {areas.map((item, index) => {
              return (
                <li className="tab" key={item}>
                  <span
                    className={index === areaIndex ? 'title active' : 'title'}
                    onClick={() => this.changeArea(index)}
                  >
                    {item}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="type-wrap">
          <span className="type-type">类型:</span>
          <ul className="tabs-wrap">
            {types.map((item, index) => {
              return (
                <li className="tab" key={item}>
                  <span
                    className={index === typeIndex ? 'title active' : 'title'}
                    onClick={() => this.changeType(index)}
                  >
                    {item}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="order-wrap">
          <span className="order-type">排序:</span>
          <ul className="tabs-wrap">
            {orders.map((item, index) => {
              return (
                <li className="tab" key={item}>
                  <span
                    className={index === orderIndex ? 'title active' : 'title'}
                    onClick={() => this.changeOrder(index)}
                  >
                    {item}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }

  // mv列表渲染
  renderMvList = () => {
    const { mvList } = this.state
    return (
      <div className="items">
        {mvList.map((item) => {
          return (
            <div
              key={item.id}
              className="item"
              onClick={() => this.toMv(item.id)}
            >
              <div className="img-wrap">
                <img src={item.cover} alt="" />
                <div className="num-wrap">
                  <div className="iconfont icon-play"></div>
                  <div className="num">{formatCount(item.playCount)}</div>
                </div>
              </div>
              <div className="info-wrap">
                <div className="name">{item.name}</div>
                <div className="singer">{item.artisetName}</div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // 分页条渲染
  renderPagination = () => {
    const { page, total, limit } = this.state
    return (
      <div style={{ textAlign: 'center' }}>
        <Pagination
          current={page}
          onChange={this.onChange}
          total={total}
          pageSize={limit}
          showSizeChanger={false}
        />
      </div>
    )
  }

  changeArea = (index) => {
    this.setState(
      {
        areaIndex: index,
        page: 1,
      },
      () => {
        this.getMvListData()
      }
    )
  }

  changeType = (index) => {
    this.setState(
      {
        typeIndex: index,
        page: 1,
      },
      () => {
        this.getMvListData()
      }
    )
  }

  changeOrder = (index) => {
    this.setState(
      {
        orderIndex: index,
        page: 1,
      },
      () => {
        this.getMvListData()
      }
    )
  }

  onChange = (page) => {
    this.setState(
      {
        page,
      },
      () => {
        this.getMvListData()
      }
    )
  }

  toMv = (id) => {
    this.props.history.push(`/mv/${id}`)
  }

  render() {
    return (
      <div className="mvs-container">
        {/* 渲染条件 */}
        {this.renderCondition()}
        {/* 渲染列表内容和分页条 */}
        <div className="mvs">
          {/* mv列表 */}
          {this.renderMvList()}
          {/* 分页条 */}
          {this.renderPagination()}
        </div>
      </div>
    )
  }
}
