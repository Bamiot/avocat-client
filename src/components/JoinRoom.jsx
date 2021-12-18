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
    outFlag: false,
    inFlag: false
  }

  outRoomScreen = () => {
    this.setState({ roomScreen: true, outFlag: true })
    setTimeout(() => {
      this.setState({ roomScreen: false, outFlag: false })
      this.inNameScreen()
    }, inOutStyleData.duration)
  }

  inNameScreen = () => {
    this.setState({ nameScreen: true, inFlag: true })
    setTimeout(() => {
      this.setState({ nameScreen: true, inFlag: false })
    }, inOutStyleData.duration)
  }

  outNameScreen = () => {
    this.setState({ nameScreen: true, outFlag: true })
    setTimeout(() => {
      this.setState({ nameScreen: false, outFlag: false })
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
      inFlag,
      showPassword
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
            <button
              onClick={(e) => {
                e.preventDefault()
                if (roomName.length > 0) this.outRoomScreen()
              }}
            >
              Ok
            </button>
          </form>
        ) : null}
        {nameScreen && !roomScreen ? (
          <form
            className={`choiceName${inFlag ? ' right-in' : ''}${
              outFlag ? ' left-out' : ''
            }`}
            style={inOutStyle}
          >
            <span>Choose a name</span>
            <input
              type="text"
              placeholder="Name"
              autoFocus
              value={userName}
              onChange={(e) => {
                if (this.verifyInput(e.target.value))
                  this.setState({ userName: e.target.value })
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault()
                if (userName.length > 0) this.handleSubmit()
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
