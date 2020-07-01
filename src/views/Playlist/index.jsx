import React, { Component } from 'react'
import { Tabs, Pagination } from 'antd'
import moment from 'moment'
import { playlistDetail, hotComments, newComments } from '../../api/playlist'
import { formatDuration } from '../../utils/format'
import bus from '../../utils/bus'

const { TabPane } = Tabs

export default class Playlist extends Component {
  constructor() {
    super()

    this.state = {
      activeIndex: '1',
      tableData: [],
      title: '',
      avatarUrl: '',
      coverImgUrl: '',
      signature: '',
      nickname: '',
      tags: [],
      createTime: '',
      // 热门评论
      hotComments: [],
      // 最新评论
      newComments: [],
      // 分页相关数据
      // 最新评论每页数据
      limit: 5,
      // 页码
      page: 1,
      // 热门评论总条数
      hotCommentTotal: 0,
      // 最新评论总条数
      newCommentTotal: 0,
    }
  }

  componentDidMount() {
    this.getPlaylistDetailData()
    this.getHotCommentsData()
    this.getNewCommentsData()
  }

  async getPlaylistDetailData() {
    const res = await playlistDetail({
      id: this.props.match.params.id,
    })

    if (res.data.code === 200) {
      // 歌曲信息
      this.setState({
        tableData: res.data.playlist.tracks,
        title: res.data.playlist.name,
        avatarUrl: res.data.playlist.creator.avatarUrl,
        coverImgUrl: res.data.playlist.coverImgUrl,
        signature: res.data.playlist.creator.signature,
        nickname: res.data.playlist.creator.nickname,
        tags: res.data.playlist.tags,
        createTime: moment(res.data.playlist.createTime).format('YYYY-MM-DD'),
      })
    }
  }

  // 获取热门评论
  async getHotCommentsData() {
    const res = await hotComments({
      id: this.props.match.params.id,
    })

    if (res.data.code === 200) {
      this.setState({
        hotComments: res.data.hotComments,
        hotCommentTotal: res.data.total,
      })
    }
  }

  // 获取最新评论
  async getNewCommentsData() {
    const { page, limit } = this.state
    const res = await newComments({
      id: this.props.match.params.id,
      offset: (page - 1) * limit,
    })

    if (res.data.code === 200) {
      this.setState({
        newComments: res.data.comments,
        newCommentTotal: res.data.total,
      })
    }
  }

  renderPlaylistDetail = () => {
    const {
      coverImgUrl,
      avatarUrl,
      nickname,
      createTime,
      tags,
      title,
      signature,
    } = this.state
    return (
      <div>
        <div className="top-wrap">
          <div className="img-wrap">
            <img src={coverImgUrl} alt="" />
          </div>
          <div className="info-wrap">
            <p className="title">{title}</p>
            <div className="author-wrap">
              <img className="avatar" src={avatarUrl} alt="" />
              <span className="name">{nickname}</span>
              <span className="time">{createTime} 创建</span>
            </div>
            <div className="tag-wrap">
              <span className="title">标签:</span>
              <ul>
                {tags.map((item) => {
                  return <li key={item}>{item}</li>
                })}
              </ul>
            </div>
            <div className="desc-wrap">
              <span className="title">简介:</span>
              <span className="desc">{signature}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 渲染播放列表
  renderPlaylistTable = () => {
    const { tableData } = this.state
    return (
      <table className="el-table playlit-table">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => {
            return (
              <tr className="el-table__row" key={item.id}>
                <td>{index + 1}</td>
                <td>
                  <div
                    className="img-wrap"
                    onClick={() => this.playMusic(item.id)}
                  >
                    <img src={item.al.picUrl} alt="" />
                    <span className="iconfont icon-play"></span>
                  </div>
                </td>
                <td>
                  <div className="song-wrap">
                    <div className="name-wrap">
                      <span>{item.name}</span>
                      {item.mv !== 0 && (
                        <span
                          onClick={() => this.toMV(item.mv)}
                          className="iconfont icon-mv"
                        ></span>
                      )}
                    </div>
                    <span>{item.subTitle}</span>
                  </div>
                </td>
                <td>{item.ar[0].name}</td>
                <td>{item.al.name}</td>
                <td>{formatDuration(item.dt)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  // 渲染评论列表(热门评论 + 最新评论)
  renderComments = () => {
    const {
      hotComments,
      newComments,
      hotCommentTotal,
      newCommentTotal,
      page,
      limit,
    } = this.state
    // 热门评论
    return (
      <div>
        {hotComments.length > 0 && (
          <div className="comment-wrap">
            <p className="title">
              热门评论<span className="number">({hotCommentTotal})</span>
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
                        <>
                          <div className="re-content">
                            <span className="name">
                              {item.beReplied[0].user.nickname}：
                            </span>
                            <span className="comment">
                              {item.beReplied[0].content}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="date">
                        {moment(item.time).format('YYYY-MM-DD hh:mm:ss')}
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
              最新评论<span className="number">({newCommentTotal})</span>
            </p>
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
                      {moment(item.time).format('YYYY-MM-DD hh:mm:ss')}
                    </div>
                  </div>
                </div>
              )
            })}
            {/* 分页条 */}
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Pagination
                current={page}
                onChange={this.onChange}
                total={newCommentTotal}
                pageSize={limit}
                showSizeChanger={false}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  playMusic = (id) => {
    bus.emit('playMusic', id)
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
    const { hotCommentTotal, newCommentTotal } = this.state
    return (
      <div className="playlist-container">
        {/* 渲染歌单信息 */}
        {this.renderPlaylistDetail()}
        {/* 渲染Tab */}
        <Tabs defaultActiveKey="1">
          <TabPane tab="歌曲列表" key="1">
            {this.renderPlaylistTable()}
          </TabPane>
          <TabPane tab={`评论(${hotCommentTotal + newCommentTotal})`} key="2">
            {this.renderComments()}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
