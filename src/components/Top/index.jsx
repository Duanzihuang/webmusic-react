import React, { Component } from 'react'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export default class Index extends Component {
  goToSearchPage = (e) => {
    window.open(`#/search/${e.target.value}`, '_self')
  }

  render() {
    return (
      <div className="top-container">
        <div className="left-box">
          <div className="icon-wrapper">
            <span
              onClick={() => window.history.go('/')}
              className="iconfont icon-home"
            ></span>
            <span className="iconfont icon-sami-select"></span>
            <span className="iconfont icon-full-screen"></span>
          </div>
          <div className="history-wrapper">
            <span
              onClick={() => window.history.go(-1)}
              className="iconfont icon-arrow-lift"
            ></span>
            <span
              onClick={() => window.history.go(1)}
              className="iconfont icon-arrow-right"
            ></span>
          </div>
        </div>
        <div className="right-box">
          <Input
            size="middle"
            prefix={<SearchOutlined />}
            placeholder="搜索"
            onPressEnter={this.goToSearchPage}
          ></Input>
        </div>
      </div>
    )
  }
}
