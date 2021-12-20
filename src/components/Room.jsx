import React, { Component } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
const socket = io.connect('http://localhost:3002/', { transports: ['websocket'] })

class Room extends Component {
  state = {}
  componentDidMount = () => {
    const { roomId, username } = this.state
    socket.emit('roomState', (roomId, username))
    socket.on('roomState', (room) => {
      this.setState({ roomState: room })
    })
  }
  ready = () => {
    const { roomId, username } = this.state
    axios
      .get(`/ready?room_id=${roomId}&user=${username}`)
      .then((res) => {
        if (!res.error) {
          socket.emit('roomState', this.state.data.roomId)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  render() {
    return <div>{JSON.stringify(this.state)}</div>
  }
}

export default Room
