// import
import React from 'react'

import './styles/app.scss'

// components
import CreateRoom from './components/CreateRoom'
import JoinRoom from './components/JoinRoom'
import PublicRoomList from './components/PublicRoomList'

export default class App extends React.Component {
  state = { inFlag: false, outFlag: false }

  componentDidMount = () => {}

  render = () => {
    const { inFlag, outFlag } = this.state
    return (
      <div className="App">
        <div
          className={`room-page ${inFlag ? 'left-in' : ''}${outFlag ? 'right-out' : ''}`}
        >
          <PublicRoomList />
          <div className="room-container">
            <CreateRoom />
            <JoinRoom />
          </div>
        </div>
      </div>
    )
  }
}
