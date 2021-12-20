// import
import React from 'react'

import './styles/app.scss'

// components
import CreateRoom from './components/CreateRoom'
import JoinRoom from './components/JoinRoom'
import PublicRoomList from './components/PublicRoomList'
import Room from './components/Room'

const inOutStyleData = {
  duration: 1000
}

const inOutStyle = {
  animationDuration: `${inOutStyleData.duration}ms`
}

export default class App extends React.Component {
  state = { inFlag: false, outFlag: false, roomPage: false, joinPage: false }

  componentDidMount = () => {
    this.inJoinPage()
  }

  inJoinPage = () => {
    this.setState({ joinPage: true, inFlag: true })
    setTimeout(() => {
      this.setState({ joinPage: true, inFlag: false })
    }, inOutStyleData.duration)
  }

  outJoinPage = () => {
    this.setState({ outFlag: true })
    setTimeout(() => {
      this.setState({ joinPage: false, outFlag: false })
    }, inOutStyleData.duration)
  }

  joinRoom = (roomId, username) => {
    this.outJoinPage()
    this.setState({ roomId, username })
    setTimeout(() => {
      this.setState({ roomPage: true, inFlag: true })
      setTimeout(() => {
        this.setState({ roomPage: true, inFlag: false })
      }, inOutStyleData.duration)
    }, 1)
  }

  render = () => {
    const { inFlag, outFlag, roomPage, joinPage } = this.state
    return (
      <div className="App">
        {roomPage || joinPage ? null : <div className="loading-spinner" />}
        {joinPage ? (
          <div
            className={`room-page ${inFlag ? 'left-in' : ''}${
              outFlag ? 'right-out' : ''
            }`}
            style={inOutStyle}
          >
            <PublicRoomList onJoin={this.joinRoom} />
            <div className="room-container">
              <CreateRoom onJoin={this.joinRoom} />
              <JoinRoom onJoin={this.joinRoom} />
            </div>
          </div>
        ) : null}
        {roomPage ? <Room /> : null}
      </div>
    )
  }
}
