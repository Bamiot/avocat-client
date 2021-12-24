import React, { Component } from 'react'
// import axios from 'axios'
import '../styles/room.scss'

// import LocalStorage from '../utils/localStorage'
import SocketHandle from '../utils/socketHandle'

class Room extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: props.username,
      roomId: props.roomId,
      roomPlayers: [],
      roomState: {}
    }
    this.socket = new SocketHandle()

    this.socket.emit('ready', {
      roomId: this.state.roomId,
      username: this.state.username,
      ready: false
    })

    this.setSocketListeners()
  }

  setSocketListeners() {
    this.socket.on('players', (players) => {
      this.setState({ roomPlayers: players })
    })
    this.socket.on('room', (room) => {
      this.setState({ roomState: room })
    })
  }

  ready = () => {
    const { roomId, username } = this.state
    this.socket.emit('ready', { roomId, username, ready: 'toogle' })
  }

  render() {
    const { username, ready, roomPlayers, roomId } = this.state
    // const {  } = this.state.roomState
    return (
      <div className="room-page-container">
        <span
          onClick={() => {
            this.socket.emit('leave', { roomId, username })
          }}
        >
          X
        </span>
        <label className="room-id-label">{roomId}</label>
        <ul className="players-list" key={JSON.stringify(this.state)}>
          {roomPlayers
            ? roomPlayers.map((player) =>
                player.username === username ? (
                  <li key={`${player.username}${player.isReady}`} className="client-name">
                    {player.username}{' '}
                    {player.isReady && player.isReady === true ? 'ready' : 'not ready'}
                  </li>
                ) : (
                  <li key={`${player.username}${player.isReady}`} className="player-name">
                    {player.username}{' '}
                    {player.isReady && player.isReady === true ? 'ready' : 'not ready'}
                  </li>
                )
              )
            : ''}
        </ul>
        <span
          className="ready"
          onClick={() => {
            this.ready()
          }}
        >
          {ready ? 'Ready to play !' : 'Press to play !'}
        </span>
      </div>
    )
  }
}

export default Room
