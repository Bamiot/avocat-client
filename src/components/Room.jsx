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
      rooId: props.roomId,
      roomPlayers: [],
      roomState: {}
    }

    this.socket = new SocketHandle()

    // did mount
    // const { roomId, username } = props

    this.socket.on('players', (players) => {
      this.setState({ roomPlayers: players })
    })

    this.socket.on('avocat', (room) => {
      this.setState({ roomState: room })
    })
  }

  ready = () => {
    const { roomId, username } = this.state
    this.socket.emit('ready', { roomId, username })
  }

  render() {
    const { username, ready, roomPlayers } = this.state
    const { roomId } = this.state.roomState
    console.log(this.state)
    return (
      <div className="room-page-container">
        <label className="room-id-label">{roomId}</label>
        <ul className="players-list">
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
