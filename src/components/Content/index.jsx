import React, { Component } from 'react'

import {
  HashRouter as Router,
  NavLink,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

// 导入子组件
import Discovery from '../../views/Discovery'
import Playlists from '../../views/Playlists'
import Playlist from '../../views/Playlist'
import Songs from '../../views/Songs'
import Mvs from '../../views/Mvs'
import Mv from '../../views/Mv'
import NotFound from '../../views/NotFound'

export default class Content extends Component {
  constructor() {
    super()

    this.state = {
      url: '',
    }
  }

  render() {
    return (
      <Router>
        <div className="index-container">
          <div className="nav">
            <ul>
              <li>
                <NavLink activeClassName="router-link-active" to="/discovery">
                  <span className="iconfont icon-find-music"></span>
                  发现音乐
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="router-link-active" to="/playlists">
                  <span className="iconfont icon-music-list"></span>
                  推荐歌单
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="router-link-active" to="/songs">
                  <span className="iconfont icon-music"></span>
                  最新音乐
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="router-link-active" to="/mvs">
                  <span className="iconfont icon-mv"></span>
                  最新MV
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="main">
            <Switch>
              <Route path="/discovery" component={Discovery} />
              <Route path="/playlists" component={Playlists} />
              <Route path="/songs" component={Songs} />
              <Route path="/mvs" component={Mvs} />
              <Route path="/playlist/:id" component={Playlist} />
              <Route path="/mv/:id" component={Mv} />
              <Redirect exact from="/" to="/discovery" />
              <Route component={NotFound} />
            </Switch>
          </div>
          <div className="player">
            <audio controls autoPlay src={this.state.url} loop></audio>
          </div>
        </div>
      </Router>
    )
  }
}
