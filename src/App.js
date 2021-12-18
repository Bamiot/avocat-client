// import
import React from 'react'

import './styles/app.scss'

// components
import CreateRoom from './components/CreateRoom'
import JoinRoom from './components/JoinRoom'
import PublicRoomList from './components/PublicRoomList'

export default class App extends React.Component {
  state = {}

  componentDidMount = () => {}

  render = () => {
    // const {} = this.state
    return (
      <div className="App">
        <PublicRoomList />
        <div className="room-container">
          <CreateRoom />
          <JoinRoom />
        </div>
      </div>
    )
  }
}
