import React, { Component } from 'react'
import '../styles/room.scss'

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

  leaveRoom = () => {
    const { roomId, username } = this.state
    this.socket.emit('leave', { roomId, username })
  }

  render() {
    const { username, roomPlayers, roomState, roomId } = this.state
    const client = roomPlayers.find((player) => player.username === username)

    return (
      <div className="room-page-container">
        <i className="fas fa-times return-btn" onClick={this.leaveRoom} />
        <span className="room-id">{roomId}</span>
        <ul className="room-players">
          {roomPlayers
            ? roomPlayers.map((player, index) => (
                <li key={index}>
                  <span
                    className={`player-name ${
                      username === player.username ? 'client-name' : ''
                    }`}
                  >
                    {player.username}
                  </span>
                  {player.isReady ? (
                    <i className="fas fa-check player-ready text-green" />
                  ) : (
                    <span className="waiting-dots player-ready">
                      <span className="dot-1" />
                      <span className="dot-2" />
                      <span className="dot-3" />
                    </span>
                  )}
                  {player.username === roomState.owner ? (
                    <i className="fas fa-crown player-owner" />
                  ) : null}
                </li>
              ))
            : null}
        </ul>
        {client ? (
          <button className={`room-ready-btn`} onClick={this.ready}>
            {client.isReady ? 'Not ready !' : 'Ready !'}
            <i
              className={`fas fa-${
                !client.isReady ? 'check text-green' : 'times text-red'
              }`}
            />
          </button>
        ) : null}
      </div>
    )
  }
}

export default Room
