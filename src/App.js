// import
import React from 'react'

import './styles/app.scss'

import LocalStorage from './utils/localStorage'

// components
import CreateRoom from './components/CreateRoom'
import JoinRoom from './components/JoinRoom'
import PublicRoomList from './components/PublicRoomList'
import Room from './components/Room'
import SocketHandle from './utils/socketHandle'

const inOutStyleData = {
  duration: 1000
}
const inOutStyle = {
  animationDuration: `${inOutStyleData.duration}ms`
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.socket = new SocketHandle()
    this.usernameLS = new LocalStorage('username')
    this.roomIdLS = new LocalStorage('room-id')
    this.socketIdLS = new LocalStorage('socket-id')

    const username = this.usernameLS.get()
    if (username) console.log('Saved username:', username)

    this.state = {
      inFlag: false,
      outFlag: false,
      roomPage: false,
      joinPage: false,
      username: username && username.length > 1 ? username : undefined
    }

    // socket listener
    this.socket.on('error', (err) => {
      console.error(err)
    })
    this.socket.on('disconnect', (reason) => {
      this.roomIdLS.remove()
      this.socketIdLS.remove()
      alert(reason)
      this.outRoomPage()
    })
    this.socket.on('join', (socketId) => {
      this.socketIdLS.set(socketId)
      this.outJoinPage()
    })

    // reconnect
    const roomId = this.roomIdLS.get()
    const socketId = this.socketIdLS.get()

    if (roomId && socketId) {
      this.setState({ roomId, username })
      // this.socket.emit('reconnect', { roomId, username, socketId })
      // this.inRoomPage()
    } else {
      this.inJoinPage()
    }
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
      this.inRoomPage()
    }, inOutStyleData.duration)
  }

  inRoomPage = () => {
    this.setState({ roomPage: true, inFlag: true })
    setTimeout(() => {
      this.setState({ inFlag: false })
    }, inOutStyleData.duration)
  }

  outRoomPage = () => {
    this.setState({ outFlag: true })
    setTimeout(() => {
      this.inJoinPage()
      this.setState({ roomPage: false, outFlag: false })
    }, inOutStyleData.duration)
  }

  joinRoom = (roomId, username) => {
    this.setState({ roomId, username })
    this.outJoinPage()
    this.socket.emit('join', { roomId: this.state.roomId, username: this.state.username })
    this.roomIdLS.set(roomId)
    this.usernameLS.set(username)
  }

  render = () => {
    const { inFlag, outFlag, roomPage, joinPage, roomId, username } = this.state
    return (
      <div className="App">
        {roomPage || joinPage ? null : <div className="loading-spinner" />}
        {joinPage ? (
          <div
            className={`join-room-page ${inFlag ? 'left-in' : ''}${
              outFlag ? 'right-out' : ''
            }`}
            style={inOutStyle}
          >
            <PublicRoomList username={username} onJoin={this.joinRoom} />
            <div
              className={`create-join-container ${inFlag ? 'left-in' : ''}`}
              style={inOutStyle}
            >
              <CreateRoom username={username} onJoin={this.joinRoom} />
              <JoinRoom username={username} onJoin={this.joinRoom} />
            </div>
          </div>
        ) : null}
        {roomPage ? (
          <div
            className={`game-page ${inFlag ? 'left-in' : ''}${
              outFlag ? 'right-out' : ''
            }`}
            style={inOutStyle}
          >
            <Room roomId={roomId} username={username} />
          </div>
        ) : null}
      </div>
    )
  }
}
