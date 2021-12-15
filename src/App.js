// import
import React from 'react'
import axios from 'axios'

import './styles/app.scss'

// components
import CreateRoom from './components/CreateRoom'
import JoinRoom from './components/JoinRoom'

export default class App extends React.Component {
  state = {
    isLogged: false,
    data: '',
    room: undefined
  }

  componentDidMount = () => {}
  handleJoin = (username, room_id) => {
    axios
      .get(`http://localhost:4081/room?room_id=${room_id}&username=${username}`)
      .then((res) => {
        if (res.status === 200) {
          this.setState({ username, room: res.data, isLogged: true })
        } else console.log('e')
      })
  }

  render = () => {
    const { isLogged, room, username } = this.state
    return (
      <div className="App">
        <CreateRoom />
      </div>
    )
  }
}
