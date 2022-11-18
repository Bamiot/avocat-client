import React, { Component } from 'react'
import '../styles/room.scss'
import Game from './game/Game'

import SocketHandle from '../utils/socketHandle'

class Room extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: props.username,
      roomId: props.roomId,
      roomPlayers: [],
      room: {},
      inGame: false
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
      this.setState({ room })
      if (room.inGame) this.setState({ inGame: true })
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

  startGame = () => {
    const { roomId, username } = this.state
    this.socket.emit('start', { roomId, username })
  }

  render() {
    const { username, roomPlayers, room, roomId, inGame } = this.state
    const client = roomPlayers.find((player) => player.username === username)
    console.log(room.owner);
    return (
      <div className="room-page-container">
        <div className={`room-hub ${inGame ? 'inGame' : ''}`}>
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
                    {player.online ? null : <i className="fas fa-signal signal-slash" />}
                    {/* ready indicator  */}
                    {player.isReady ? (
                      <i
                        className={`fas fa-check player-ready text-green ${
                          inGame ? ' hide' : ''
                        }`}
                      />
                    ) : (
                      <span className="waiting-dots player-ready">
                        <span className="dot-1" />
                        <span className="dot-2" />
                        <span className="dot-3" />
                      </span>
                    )}
                    {/* owner indicator */}
                    {player.username === room.owner ? (
                      <i className="fas fa-crown player-owner" />
                    ) : null}
                    {/* kick button */}
                    {room.owner === username && player.username !== room.owner ? (
                      <i
                        className="fas fa-user-slash player-kick"
                        onClick={() => {
                          console.log('kick', player.username)
                          this.socket.emit('kick', {
                            roomId,
                            kickedPlayerName: player.username
                          })
                        }}
                      />
                    ) : null}
                  </li>
                ))
              : null}
          </ul>
          {/* Ready Button */}
          {client && (!client.isReady || client.username !== room.owner) && !inGame ? (
            <button className={`room-ready-btn`} onClick={this.ready}>
              {client.isReady ? 'Not ready !' : 'Ready !'}
              <i
                className={`fas fa-${
                  !client.isReady ? 'check text-green' : 'times text-red'
                }`}
              />
            </button>
          ) : null}
          {/* Start Button */}
          {client && client.username !== room.owner && client.isReady && !inGame ? (
            <button className={`room-start-btn`} onClick={this.startGame}>
              {'Start !'}
              <i className={`fas fa-angle-right`} />
            </button>
          ) : null}
        </div>
        {inGame && room && room.gameState ? (
          <Game gameState={room.gameState} username={username} />
        ) : null}
    
      </div>
    )
  }
}

export default Room
