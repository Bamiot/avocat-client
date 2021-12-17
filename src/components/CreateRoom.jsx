import react from 'react'
import axios from 'axios'
import '../styles/joinCreateRoom.scss'

export default class CreateRoom extends react.Component {
  state = {
    roomName: '',
    userName: '',
    privateRoom: false,
    roomScreen: true,
    nameScreen: false,
    outFlag: false,
    inFlag: false
  }

  outRoomScreen = () => {
    this.setState({ roomScreen: true, outFlag: true })
    setTimeout(() => {
      this.setState({ roomScreen: false, outFlag: false })
    }, 500)
  }

  inNameScreen = () => {
    this.setState({ nameScreen: true, inFlag: true })
    setTimeout(() => {
      this.setState({ nameScreen: true, inFlag: false })
    }, 500)
  }

  handleSubmit = () => {
    const { roomName, privateRoom, password, outFlag } = this.state
    if (
      roomName.length > 0 &&
      (!privateRoom || (privateRoom && password && password.length > 0))
    ) {
      this.outRoomScreen()
      setTimeout(this.inNameScreen, 3000)
      axios
        .get(
          `/rooms/create?id_room=${roomName}${privateRoom ? `&password=${password}` : ''}`
        )
        .then((res) => {
          this.inNameScreen()
          console.log(res)
        })
        .catch((err) => console.log(err))
    }
  }

  handleJoin = () => {
    const { roomName, password, userName, privateRoom } = this.state
    if (roomName.length > 0) {
      this.setState({ roomScreen: false, nameScreen: false })
      axios
        .get(
          `/rooms/join?id_room=${roomName}&username=${userName}${
            privateRoom ? `&password=${password}` : ''
          }`
        )
        .then((res) => {
          console.log(res)
        })
        .catch((err) => console.log(err))
    }
  }

  verifyInput = (value) => {
    const alphaTest = new RegExp('^[a-zA-Z0-9_]*$')
    return alphaTest.test(value)
  }

  render() {
    const {
      roomName,
      privateRoom,
      password,
      roomScreen,
      nameScreen,
      userName,
      outFlag,
      inFlag
    } = this.state
    return (
      <div className="joinCreateRoom-container">
        {(roomScreen && !nameScreen) || (nameScreen && !roomScreen) ? null : (
          <div className="loading-spinner" />
        )}
        {roomScreen && !nameScreen ? (
          <div className={`joinCreateRoom ${outFlag ? 'left-out' : ''}`}>
            <span>Create Room</span>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => {
                if (this.verifyInput(e.target.value))
                  this.setState({ roomName: e.target.value })
              }}
            />
            <div className="checkbox-private">
              <input
                type="checkbox"
                id="privateRoom"
                value={privateRoom}
                onChange={(e) => {
                  this.setState({ privateRoom: e.target.checked })
                }}
              />
              <label htmlFor="privateRoom">private</label>
            </div>
            <input
              type="text"
              placeholder="Password"
              style={privateRoom ? { visibility: 'visible' } : { visibility: 'hidden' }}
              value={password}
              onChange={(e) => {
                if (this.verifyInput(e.target.value))
                  this.setState({ password: e.target.value })
              }}
            />
            <button onClick={this.handleSubmit}>Create</button>
          </div>
        ) : null}
        {nameScreen && !roomScreen ? (
          <div className={`choiceName ${inFlag ? 'right-in' : ''}`}>
            <span>Choose a name</span>
            <input
              type="text"
              placeholder="Name"
              value={userName}
              onChange={(e) => {
                if (this.verifyInput(e.target.value))
                  this.setState({ userName: e.target.value })
              }}
            />
            <button>Ok</button>
          </div>
        ) : null}
      </div>
    )
  }
}
