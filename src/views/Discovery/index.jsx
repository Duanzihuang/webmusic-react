import React, { Component } from 'react'
import Slider from 'react-slick'
import {
  getBannerList,
  getRecommendlist,
  getNewsong,
  getMv,
} from '../../api/discovery'
import bus from '../../utils/bus'

export default class Discovery extends Component {
  constructor() {
    super()

    this.state = {
      // 轮播图
      banners: [],
      // 推荐歌单
      recommendList: [],
      // 新歌
      newsong: [],
      // mv
      mv: [],
      // 歌曲url
      songUrl: '',
    }
  }

  componentDidMount() {
    this.getBannersData()
    this.getRecommendListData()
    this.getNewSongData()
    this.getMVData()
  }

  async getBannersData() {
    const res = await getBannerList()

    if (res.data.code === 200) {
      this.setState({
        banners: res.data.banners,
      })
    }
  }

  async getRecommendListData() {
    const res = await getRecommendlist()

    if (res.data.code === 200) {
      this.setState({
        recommendList: res.data.result,
      })
    }
  }

  async getNewSongData() {
    const res = await getNewsong()

    if (res.data.code === 200) {
      this.setState({
        newsong: res.data.result,
      })
    }
  }

  async getMVData() {
    const res = await getMv()

    if (res.data.code === 200) {
      this.setState({
        mv: res.data.result,
      })
    }
  }

  renderSwiper = () => {
    const { banners } = this.state
    const settings = {
      className: 'center',
      // centerMode: true,
      infinite: true,
      speed: 500,
      autoplay: true,
    }
    return (
      <Slider {...settings}>
        {banners.map((item) => {
          return (
            <div key={item.targetId}>
              <img src={item.imageUrl} alt="" />
            </div>
          )
        })}
      </Slider>
    )
  }

  // 推荐歌单
  renderRecommend = () => {
    const { recommendList } = this.state
    return (
      <div className="recommend">
        <h3 className="title">推荐歌单</h3>
        <div className="items">
          {recommendList.map((item) => {
            return (
              <div key={item.id} className="item">
                <div
                  className="img-wrap"
                  onClick={() => this.toPlayList(item.id)}
                >
                  <div className="desc-wrap">
                    <span className="desc">{item.copywriter}</span>
                  </div>
                  <img src={item.picUrl} alt="" />
                  <span className="iconfont icon-play"></span>
                </div>
                <p className="name">{item.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // 最新音乐
  renderNewSong = () => {
    const { newsong } = this.state
    return (
      <div className="news">
        <h3 className="title">最新音乐</h3>
        <div className="items">
          {newsong.map((item) => {
            return (
              <div className="item" key={item.id}>
                <div className="img-wrap">
                  <img src={item.picUrl} alt="" />
                  <span
                    onClick={() => this.playMusic(item.id)}
                    className="iconfont icon-play"
                  ></span>
                </div>
                <div className="song-wrap">
                  <div className="song-name">{item.name}</div>
                  <div className="singer">{item.song.artists[0].name}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // 推荐Mv
  renderMv = () => {
    const { mv } = this.state
    return (
      <div className="mvs">
        <h3 className="title">推荐MV</h3>
        <div className="items">
          {mv.map((item) => {
            return (
              <div className="item" key={item.id}>
                <div className="img-wrap" onClick={() => this.toMv(item.id)}>
                  <img src={item.picUrl} alt="" />
                  <span className="iconfont icon-play"></span>
                  <div className="num-wrap">
                    <div className="iconfont icon-play"></div>
                    <div className="num">{item.playCount}</div>
                  </div>
                </div>
                <div className="info-wrap">
                  <div className="name">{item.copywriter}</div>
                  <div className="singer">{item.artistName}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  toPlayList = (id) => {
    this.props.history.push(`/playlist/${id}`)
  }

  playMusic = (id) => {
    bus.emit('playMusic', id)
  }

  toMv = (id) => {
    this.props.history.push(`/mv/${id}`)
  }

  render() {
    return (
      <div className="discovery-container">
        {/* 渲染轮播图 */}
        {this.renderSwiper()}
        {/* 渲染推荐歌单 */}
        {this.renderRecommend()}
        {/* 渲染最新音乐 */}
        {this.renderNewSong()}
        {/* 渲染推荐MV */}
        {this.renderMv()}
      </div>
    )
  }
}
