import React, { Component } from 'react'
import { topSongs } from '../../api/songs'
import { formatDuration } from '../../utils/format'
import bus from '../../utils/bus'

export default class Songs extends Component {
  constructor() {
    super()

    this.state = {
      // 选中的类别的索引
      selectIndex: 0,
      // 类别数组
      types: [
        { type: 0, name: '全部' },
        { type: 7, name: '华语' },
        { type: 96, name: '欧美' },
        { type: 8, name: '日本' },
        { type: 16, name: '韩国' },
      ],
      tableData: [],
    }
  }

  componentDidMount() {
    this.getSongData()
  }

  async getSongData() {
    const { selectIndex } = this.state
    const res = await topSongs({
      type: this.state.types[selectIndex].type,
    })

    if (res.data.code === 200) {
      this.setState({
        tableData: res.data.data.map((item) => {
          return {
            id: item.id,
            album: {
              picUrl: item.album.picUrl,
              name: item.album.name,
            },
            name: item.name,
            mvid: item.mvid,
            subTitle: item.subTitle,
            artists: [
              {
                name: item.artists[0].name,
              },
            ],
            duration: item.duration,
          }
        }),
      })
    }
  }

  changeType = (index) => {
    this.setState(
      {
        selectIndex: index,
      },
      () => {
        this.getSongData()
      }
    )
  }

  playMusic = (id) => {
    bus.emit('playMusic', id)
  }

  toMV = (id) => {
    this.props.history.push(`/mv/${id}`)
  }

  render() {
    const { types, selectIndex, tableData } = this.state
    return (
      <div className="songs-container">
        {/* 头部 */}
        <div className="tab-bar">
          {types.map((item, index) => {
            return (
              <span
                className={index === selectIndex ? 'item active' : 'item'}
                key={item.type}
                onClick={() => this.changeType(index)}
              >
                {item.name}
              </span>
            )
          })}
        </div>
        {/* table部分 */}
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
                      <img src={item.album.picUrl} alt="" />
                      <span className="iconfont icon-play"></span>
                    </div>
                  </td>
                  <td>
                    <div className="song-wrap">
                      <div className="name-wrap">
                        <span>{item.name}</span>
                        {item.mvid !== 0 && (
                          <span
                            className="iconfont icon-mv"
                            onClick={() => this.toMV(item.mvid)}
                          ></span>
                        )}
                      </div>
                      <span>{item.subTitle}</span>
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
      </div>
    )
  }
}
