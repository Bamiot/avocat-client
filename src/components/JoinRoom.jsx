import react from 'react'
import axios from 'axios'
import '../styles/joinCreateRoom.scss'

const inOutStyleData = {
  duration: 500
}

const inOutStyle = {
  animationDuration: `${inOutStyleData.duration}ms`
}

export default class CreateRoom extends react.Component {
  state = {
    roomName: '',
    userName: '',
    password: '',
    roomScreen: true,
    nameScreen: false,
    outFlag: false
  }

  outRoomScreen = () => {
    this.setState({ roomScreen: true, outFlag: true })
    setTimeout(() => {
      this.setState({ roomScreen: false, outFlag: false })
      this.handleSubmit()
    }, inOutStyleData.duration)
  }

  handleSubmit = () => {
    const { roomName, password, userName } = this.state
    if (roomName.length > 0) {
      this.outNameScreen()
      axios
        .get(
          `/rooms/join?room_id=${roomName}&username=${userName}${
            password.length > 0 ? `&password=${password}` : ''
          }`
        )
        .then((res) => {
          console.log(res)
        })
        .catch((err) => console.error(err))
    }
  }

  verifyInput = (value) => {
    const alphaTest = new RegExp('^[a-zA-Z0-9_]*$')
    return alphaTest.test(value)
  }

  shakeError = (event) => {
    event.target.classList.add('error-shake')
    setTimeout(() => {
      event.target.classList.remove('error-shake')
    }, 250)
  }

  render() {
    const {
      roomName,
      password,
      roomScreen,
      nameScreen,
      userName,
      outFlag,
      showPassword,
      hideFlag
    } = this.state
    return (
      <div className="joinCreateRoom-container">
        {(roomScreen && !nameScreen) || (nameScreen && !roomScreen) ? null : (
          <div className="loading-spinner" />
        )}
        {roomScreen && !nameScreen ? (
          <form
            className={`joinCreateRoom${outFlag ? ' left-out' : ''}`}
            style={inOutStyle}
          >
            <span>Join Room</span>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => {
                e.preventDefault()
                if (this.verifyInput(e.target.value))
                  this.setState({ roomName: e.target.value })
                else this.shakeError(e)
              }}
            />
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  e.preventDefault()
                  if (this.verifyInput(e.target.value))
                    this.setState({ password: e.target.value })
                  else this.shakeError(e)
                }}
              />
              <i
                class={`fas fa-eye${showPassword ? '-slash' : ''}`}
                onClick={(e) => {
                  this.setState({ showPassword: !showPassword })
                }}
              ></i>
            </div>
            <input
              type="text"
              placeholder="Name"
              value={userName}
              onChange={(e) => {
                if (this.verifyInput(e.target.value))
                  this.setState({ userName: e.target.value })
                else this.shakeError(e)
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault()
                if (roomName.length > 0 && userName.length > 0) this.outRoomScreen()
              }}
            >
              Join
            </button>
          </form>
        ) : null}
      </div>
    )
  }
}
