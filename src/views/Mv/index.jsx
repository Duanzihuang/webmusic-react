import React, { Component } from 'react'
import {
  mvUrl,
  simiMV,
  mvDetail,
  artistInfo,
  hotComments,
  newComments,
} from '../../api/mv'
import { formatCount, formatDuration } from '../../utils/format'
import moment from 'moment'
import { Pagination } from 'antd'
import bus from '../../utils/bus'

export default class Mv extends Component {
  constructor() {
    super()

    this.state = {
      // mv地址
      mvUrl: '',
      // 相似MV列表
      simiMV: [],
      // 热门评论
      hotComments: [],
      // 最新评论
      newComments: [],
      // 分页相关数据
      // 页码
      page: 1,
      // 每页显示条数
      limit: 5,
      // 总条数
      total: 0,
      // mv的名字
      mvName: '',
      // 播放次数
      playCount: '',
      // 发布时间
      publishTime: '',
      // 描述
      desc: '',
      // 歌手名
      artistName: '',
      // 封面
      artistCover: '',
    }
  }

  componentDidMount() {
    bus.emit('pauseMusic')

    this.mvId = this.props.match.params.id
    this.getData()
  }

  componentWillReceiveProps(props) {
    this.mvId = props.match.params.id
    this.getData()
  }

  getData() {
    this.getMvUrlData()
    this.getSimiMVData()
    this.getMvDetailData()
    this.getHotCommentsData()
    this.getNewCommentsData()
  }

  // 获取MV的url
  async getMvUrlData() {
    const res = await mvUrl({
      id: this.mvId,
    })

    if (res.data.code === 200) {
      this.setState({
        mvUrl: res.data.data.url,
      })
    }
  }

  // 获取相关推荐的MV列表数据
  async getSimiMVData() {
    const res = await simiMV({
      mvid: this.mvId,
    })

    if (res.data.code === 200) {
      this.setState({
        simiMV: res.data.mvs,
      })
    }
  }

  // 获取MV详情数据
  async getMvDetailData() {
    const res = await mvDetail({
      mvid: this.mvId,
    })

    if (res.data.code === 200) {
      this.setState(
        {
          mvName: res.data.data.name,
          playCount: res.data.data.playCount,
          publishTime: res.data.data.publishTime,
          desc: res.data.data.desc,
        },
        () => {
          // 获取艺术家信息
          this.getArtistInfoData(res.data.data.artistId)
        }
      )
    }
  }

  // 获取艺术家信息
  async getArtistInfoData(artistId) {
    const res = await artistInfo({
      artistId,
    })

    if (res.data.code === 200) {
      this.setState({
        artistName: res.data.artist.name,
        artistCover: res.data.artist.picUrl,
      })
    }
  }

  // 获取热门评价数据
  async getHotCommentsData() {
    const res = await hotComments({
      id: this.mvId,
    })

    if (res.data.code === 200) {
      this.setState({
        hotComments: res.data.hotComments,
      })
    }
  }

  // 获取最新评价数据
  async getNewCommentsData() {
    const { page, limit } = this.state
    const res = await newComments({
      id: this.mvId,
      offset: (page - 1) * limit,
      limit,
    })

    if (res.data.code === 200) {
      this.setState({
        newComments: res.data.comments,
        total: res.data.total,
      })
    }
  }

  // 渲染Mv视频播放器
  renderMvVideo = () => {
    return (
      <div>
        <h3 className="title">mv详情</h3>
        <div className="video-wrap">
          <video autoPlay controls src={this.state.mvUrl}></video>
        </div>
      </div>
    )
  }

  // 渲染MV详情信息
  renderMvInfo = () => {
    const {
      artistCover,
      artistName,
      mvName,
      publishTime,
      playCount,
      desc,
    } = this.state
    return (
      <div className="info-wrap">
        <div className="singer-info">
          <div className="avatar-wrap">
            <img src={artistCover} alt="" />
          </div>
          <span className="name">{artistName}</span>
        </div>
        <div className="mv-info">
          <h2 className="title">{mvName}</h2>
          <span className="date">发布：{publishTime}</span>
          <span className="number">播放：{formatCount(playCount)}次</span>
          <p className="desc">{desc}</p>
        </div>
      </div>
    )
  }

  // 渲染相关推荐
  renderMvRecommend = () => {
    const { simiMV } = this.state
    return (
      <div>
        <h3 className="title">相关推荐</h3>
        <div className="mvs">
          {simiMV.map((item) => {
            return (
              <div className="items" key={item.id}>
                <div className="item" onClick={() => this.toMV(item.id)}>
                  <div className="img-wrap">
                    <img src={item.cover} alt="" />
                    <span className="iconfont icon-play"></span>
                    <div className="num-wrap">
                      <div className="iconfont icon-play"></div>
                      <div className="num">{formatCount(item.playCount)}</div>
                    </div>
                    <span className="time">
                      {formatDuration(item.duration)}
                    </span>
                  </div>
                  <div className="info-wrap">
                    <div className="name">{item.name}</div>
                    <div className="singer">{item.artistName}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // 渲染评价内容
  renderComments = () => {
    const { hotComments, newComments, page, limit, total } = this.state
    return (
      <div>
        {hotComments.length > 0 && (
          <div className="comment-wrap">
            <p className="title">
              热门评论<span className="number">({hotComments.length})</span>
            </p>
            {hotComments.map((item) => {
              return (
                <div className="comments-wrap" key={item.commentId}>
                  <div className="item">
                    <div className="icon-wrap">
                      <img src={item.user.avatarUrl} alt="" />
                    </div>
                    <div className="content-wrap">
                      <div className="content">
                        <span className="name">{item.user.nickname}：</span>
                        <span className="comment">{item.content}</span>
                      </div>
                      {item.beReplied.length > 0 && (
                        <div className="re-content">
                          <span className="name">
                            {item.beReplied[0].user.nickname}：
                          </span>
                          <span className="comment">
                            {item.beReplied[0].content}
                          </span>
                        </div>
                      )}

                      <div className="date">
                        {moment(item.time).format('YYYY-MM-DD')}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {/* 最新评论 */}
        {newComments.length > 0 && (
          <div className="comment-wrap">
            <p className="title">
              最新评论<span className="number">({total})</span>
            </p>
            <div className="comments-wrap">
              {newComments.map((item) => {
                return (
                  <div className="item" key={item.commentId}>
                    <div className="icon-wrap">
                      <img src={item.user.avatarUrl} alt="" />
                    </div>
                    <div className="content-wrap">
                      <div className="content">
                        <span className="name">{item.user.nickname}：</span>
                        <span className="comment">{item.content}</span>
                      </div>
                      {item.beReplied.length > 0 && (
                        <div className="re-content">
                          <span className="name">
                            {item.beReplied[0].user.nickname}：
                          </span>
                          <span className="comment">
                            {item.beReplied[0].content}
                          </span>
                        </div>
                      )}

                      <div className="date">
                        {moment(item.time).format('YYYY-MM-DD')}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {/* 分页条 */}
        <div style={{ textAlign: 'center' }}>
          <Pagination
            current={page}
            onChange={this.onChange}
            total={total}
            pageSize={limit}
            showSizeChanger={false}
          />
        </div>
      </div>
    )
  }

  toMV = (id) => {
    this.props.history.push(`/mv/${id}`)
  }

  onChange = (page) => {
    this.setState(
      {
        page,
      },
      () => {
        this.getNewCommentsData()
      }
    )
  }

  render() {
    return (
      <div className="mv-container">
        <div className="mv-wrap">
          {/* 渲染MV视频播放器 */}
          {this.renderMvVideo()}
          {/* 渲染MV详情信息 */}
          {this.renderMvInfo()}
          {/* 渲染评价信息 */}
          {this.renderComments()}
        </div>
        <div className="mv-recommend">
          {/* 渲染相关推荐 */}
          {this.renderMvRecommend()}
        </div>
      </div>
    )
  }
}
