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

    // keep username
    const username = this.usernameLS.get()
    if (username) console.log('Saved username:', username)

    // reconnect
    const roomId = this.roomIdLS.get()
    const socketId = this.socketIdLS.get()
    this.reconnect = roomId && socketId
    if (this.reconnect) this.socket.emit('reconnect', { roomId, username, socketId })

    this.state = {
      inFlag: !this.reconnect,
      outFlag: false,
      roomPage: false,
      joinPage: !this.reconnect,
      roomId: roomId,
      username: username && username.length > 1 ? username : undefined
    }

    // socket listeners
    this.socket.on('error', ({ type, error }) => {
      console.error('socket error: ', type, error)
      switch (type) {
        case 'join':
        case 'reconnect':
        case 'disconnect':
        case 'leave':
        default:
          break
      }
    })
    this.socket.on('disconnect', (reason) => {
      this.roomIdLS.remove()
      this.socketIdLS.remove()
      console.error('disconnected for ', reason)
      this.outRoomPage()
    })
    this.socket.on('leave', () => {
      this.roomIdLS.remove()
      this.socketIdLS.remove()
      console.log('leave room')
      this.outRoomPage()
    })
    this.socket.on('join', (socketId) => {
      this.socketIdLS.set(socketId)
      console.log('save new socketid:', socketId)
      setTimeout(this.inRoomPage, inOutStyleData.duration)
    })
  }

  inJoinPage = () => {
    this.setState({ joinPage: true, inFlag: true })
    setTimeout(() => {
      this.setState({ joinPage: true, inFlag: false })
    }, inOutStyleData.duration)
  }

  outJoinPage = () => {
    this.setState({ outFlag: true, inFlag: false })
    setTimeout(() => {
      this.setState({ joinPage: false, outFlag: false })
    }, inOutStyleData.duration)
  }

  inRoomPage = () => {
    this.setState({ roomPage: true, inFlag: true })
    setTimeout(() => {
      this.setState({ inFlag: false })
    }, inOutStyleData.duration)
  }

  outRoomPage = () => {
    this.setState({ outFlag: true, inFlag: false })
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
            className={`join-room-page ${inFlag && !outFlag ? 'left-in' : ''}${
              outFlag ? 'right-out' : ''
            }`}
            style={inOutStyle}
          >
            <PublicRoomList username={username} onJoin={this.joinRoom} />
            <div
              className={`create-join-container ${inFlag && !outFlag ? 'left-in' : ''}`}
              style={inOutStyle}
            >
              <CreateRoom username={username} onJoin={this.joinRoom} />
              <JoinRoom username={username} onJoin={this.joinRoom} />
            </div>
          </div>
        ) : null}
        {roomPage && !joinPage ? (
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
