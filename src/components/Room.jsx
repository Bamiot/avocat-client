import React, { Component } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import '../styles/room.scss'
const socket = io.connect('http://localhost:3002/', { transports: ['websocket'] })

class Room extends Component {
  state = {
    roomId: this.props.roomId,
    username: this.props.username
  }
  componentDidMount = () => {
    const { roomId, username } = this.state
    console.log(username, roomId)
    socket.emit('avocat', roomId, username)
    socket.on('avocat', (room) => {
      this.setState({ roomState: room })
    })
    socket.on('disconnect' , () =>{
      console.log("deco");
    })
  }
  ready = () => {
    const { roomId, username } = this.state
    axios
      .get(`/rooms/ready?roomId=${roomId}&username=${username}`)
      .then((res) => {
        if (!res.error) {
          socket.emit('avocat', roomId)
        }
      })
      .catch((err) => {
        console.log(err.response.data)
      })
  }
  render() {
    const { username, ready } = this.state;
    const { roomId, players } = this.state.roomState ? this.state.roomState : "";
    console.log(this.state);
    return (
      <div className="room-container">
        <label className="room-id-label">Room ID: {roomId}</label>
        <ul className="players-list">
          {this.state.roomState ? players.map((player) =>
            player.username === username ? (
              <li key={`${player.username}${player.isReady}`} className="client-name">
                {player.username} {(player.isReady && player.isReady === true) ? "ready" : "not ready"}
              </li>
            ) : (
              <li key={`${player.username}${player.isReady}`} className="player-name">
                {player.username} {(player.isReady && player.isReady === true) ? "ready" : "not ready"}
              </li>
            )
          ) : ""}
        </ul>
        <span
          className="ready"
          onClick={() => {
            this.ready();
          }}
        >
          {ready ? "Ready to play !" : "Press to play !"}
        </span>
      </div>
    );
  }
}

export default Room
