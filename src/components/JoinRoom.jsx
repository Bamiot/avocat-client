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
  constructor(props) {
    super(props)
    this.state = {
      roomName: '',
      userName: '',
      password: '',
      roomScreen: true,
      nameScreen: false,
      outFlag: false
    }
    this.roomNameRef = react.createRef()
    this.userNameRef = react.createRef()
    this.passwordRef = react.createRef()
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
    if (
      alphaTest.test(value) &&
      value[0] !== ' ' &&
      value[value.length - 1] !== ' ' &&
      value.length < 30
    )
      return true
    else return false
  }

  shakeError = (target) => {
    target.classList.add('error-shake')
    setTimeout(() => {
      target.classList.remove('error-shake')
    }, 250)
  }

  redError = (target) => {
    target.classList.add('red-error')
    setTimeout(() => {
      target.classList.remove('red-error')
    }, 250)
  }

  allError = (target) => {
    this.shakeError(target)
    this.redError(target)
  }

  render() {
    const { roomName, password, roomScreen, userName, outFlag, showPassword } = this.state
    return (
      <div className="joinCreateRoom-container">
        {roomScreen ? null : <div className="loading-spinner" />}
        {roomScreen ? (
          <form
            className={`joinCreateRoom${outFlag ? ' left-out' : ''}`}
            style={inOutStyle}
          >
            <span>Join Room</span>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              ref={this.roomNameRef}
              onChange={(e) => {
                e.preventDefault()
                if (this.verifyInput(e.target.value))
                  this.setState({ roomName: e.target.value })
                else this.shakeError(e.target)
              }}
            />
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                ref={this.passwordRef}
                onChange={(e) => {
                  e.preventDefault()
                  if (this.verifyInput(e.target.value))
                    this.setState({ password: e.target.value })
                  else this.shakeError(e.target)
                }}
              />
              <i
                className={`fas fa-eye${showPassword ? '-slash' : ''}`}
                onClick={(e) => {
                  this.setState({ showPassword: !showPassword })
                }}
              ></i>
            </div>
            <input
              type="text"
              placeholder="Name"
              ref={this.userNameRef}
              value={userName}
              onChange={(e) => {
                if (this.verifyInput(e.target.value))
                  this.setState({ userName: e.target.value })
                else this.shakeError(e.target)
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault()
                if (!this.verifyInput(roomName) || roomName.length < 2)
                  this.allError(this.roomNameRef.current)
                else if (!this.verifyInput(password))
                  this.allError(this.passwordRef.current)
                else if (!this.verifyInput(userName) || userName.length < 2)
                  this.allError(this.userNameRef.current)
                else this.outRoomScreen()
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
