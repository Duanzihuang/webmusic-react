import React, { Component } from 'react'
import { Tabs, Pagination } from 'antd'
import { search } from '../../api/search'
import { formatDuration, formatCount } from '../../utils/format'
import bus from '../../utils/bus'
const { TabPane } = Tabs

export default class Search extends Component {
  constructor() {
    super()

    this.state = {
      // 类型
      type: '1',
      // 页容量
      limit: 15,
      // 页码
      page: 1,
      // 总条数
      total: 0,
      songList: [],
      playList: [],
      mvList: [],
    }
  }

  componentDidMount() {
    this.keyword = this.props.match.params.keyword
    this.getSearchResultData()
  }

  componentWillReceiveProps(props) {
    this.keyword = props.match.params.keyword
    this.getSearchResultData()
  }

  async getSearchResultData() {
    const { type, page, limit } = this.state
    const res = await search({
      keywords: this.keyword,
      type,
      limit,
      offset: (page - 1) * limit,
    })

    if (res.data.code === 200) {
      switch (type) {
        case '1': // 歌曲
          this.setState({
            songList: res.data.result.songs,
            total: res.data.result.songCount,
          })
          break

        case '1000': // 歌单
          this.setState({
            playList: res.data.result.playlists,
            total: res.data.result.playlistCount,
          })
          break

        case '1004': // MV
          this.setState({
            mvList: res.data.result && res.data.result.mvs,
            total: res.data.result.mvCount,
          })
          break

        default:
          break
      }
    }
  }

  // 渲染歌曲列表
  renderSongList = () => {
    const { songList } = this.state

    return (
      <table className="el-table">
        <thead>
          <tr>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </tr>
        </thead>
        <tbody>
          {songList.map((item, index) => {
            return (
              <tr
                className="el-table__row"
                key={item.id}
                onDoubleClick={() => this.rowDbclick(item.id)}
              >
                <td>{index + 1}</td>
                <td>
                  <div className="song-wrap">
                    <div className="name-wrap">
                      <span className="name">{item.name}</span>

                      {item.mvid !== 0 && (
                        <span
                          className="iconfont icon-mv"
                          onClick={() => this.toMV(item.mvid)}
                        ></span>
                      )}
                    </div>
                    {item.alias.length !== 0 && (
                      <span className="sub-name">{item.alias[0]}</span>
                    )}
                  </div>
                </td>
                <td>{item.artists[0].name}</td>
                <td>{item.album.name}</td>
                <td>{formatDuration(item.duration)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  // 渲染歌单列表
  renderPlayList = () => {
    const { playList } = this.state
    return (
      <div className="items">
        {playList.map((item) => {
          return (
            <div
              className="item"
              key={item.id}
              onClick={() => this.toPlaylist(item.id)}
            >
              <div className="img-wrap">
                <div className="num-wrap">
                  播放量:
                  <span className="num">{formatCount(item.playCount)}</span>
                </div>
                <img src={item.coverImgUrl} alt="" />
                <span className="iconfont icon-play"></span>
              </div>
              <p className="name">{item.name}</p>
            </div>
          )
        })}
      </div>
    )
  }

  renderMvList = () => {
    const { mvList } = this.state

    return (
      <div className="items mv">
        {mvList.map((item) => {
          return (
            <div
              className="item"
              key={item.id}
              onClick={() => this.toMV(item.id)}
            >
              <div className="img-wrap">
                <img src={item.cover} alt="" />
                <span className="iconfont icon-play"></span>
                <div className="num-wrap">
                  <div className="iconfont icon-play"></div>
                  <div className="num">{formatCount(item.playCount)}</div>
                </div>
                <span className="time">{formatDuration(item.duration)}</span>
              </div>
              <div className="info-wrap">
                <div className="name">{item.name}</div>
                <div className="singer">{item.artistName}</div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  changeType = (key) => {
    this.setState(
      {
        type: key,
        page: 1,
        limit: key === '1004' ? 12 : 15,
      },
      () => {
        this.getSearchResultData()
      }
    )
  }

  rowDbclick = (id) => {
    bus.emit('playMusic', id)
  }

  toMV = (id) => {
    this.props.history.push(`/mv/${id}`)
  }

  toPlaylist = (id) => {
    this.props.history.push(`/playlist/${id}`)
  }

  onChange = (page) => {
    this.setState(
      {
        page,
      },
      () => {
        this.getSearchResultData()
      }
    )
  }

  render() {
    const { total, page, limit, songList, playList, mvList } = this.state
    return (
      <div className="result-container">
        <div className="title-wrap">
          <h2
            style={{ marginBottom: 0, fontWeight: 'bold', fontSize: '1.5em' }}
            className="title"
          >
            {this.props.match.params.keyword}
          </h2>
          <span className="sub-title">找到{total}个结果</span>
        </div>
        <Tabs defaultActiveKey="1" onChange={this.changeType}>
          <TabPane tab="歌曲" key="1">
            {songList.length > 0 && this.renderSongList()}
          </TabPane>
          <TabPane tab="歌单" key="1000">
            {playList.length > 0 && this.renderPlayList()}
          </TabPane>
          <TabPane tab="MV" key="1004">
            {mvList && mvList.length > 0 && this.renderMvList()}
          </TabPane>
        </Tabs>
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
}
