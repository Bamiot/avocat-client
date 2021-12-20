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
      errorScreen: false,
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

  inRoomScreen = () => {
    this.setState({ roomScreen: true, inFlag: true })
    setTimeout(() => {
      this.setState({ roomScreen: true, inFlag: false })
    }, inOutStyleData.duration)
  }

  inErrorScreen = (error) => {
    this.setState({ errorScreen: error, inFlag: true })
    setTimeout(() => {
      this.setState({ errorScreen: error, inFlag: false })
    }, inOutStyleData.duration)
  }

  outErrorScreen = () => {
    this.setState({ outFlag: true })
    setTimeout(() => {
      this.setState({ errorScreen: false, outFlag: false })
      this.inRoomScreen()
    }, inOutStyleData.duration)
  }

  handleSubmit = () => {
    const { roomName, password, userName } = this.state
    if (roomName.length > 0) {
      axios
        .get(
          `/rooms/join?room_id=${roomName}&username=${userName}${
            password.length > 0 ? `&password=${password}` : ''
          }`
        )
        .then((res) => {
          console.log(res)
          this.props.onJoin(res.data.roomId, userName)
        })
        .catch((err) => {
          console.error(err)
          console.error(err.response)
          this.inErrorScreen(err.response.data.error)
        })
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
    const {
      roomName,
      password,
      roomScreen,
      userName,
      outFlag,
      inFlag,
      showPassword,
      errorScreen
    } = this.state
    return (
      <div className="joinCreateRoom-container">
        {roomScreen || errorScreen ? null : <div className="loading-spinner" />}
        {errorScreen ? (
          <div
            className={`errorScreen ${inFlag ? ' right-in' : ''}${
              outFlag ? ' right-out' : ''
            }`}
          >
            <i className="fas fa-times-circle"></i>
            <span>{typeof errorScreen === 'string' ? errorScreen : ' '}</span>
            <button
              className="primary-button"
              onClick={(e) => {
                this.outErrorScreen()
              }}
            >
              <i className="fas fa-angle-left" /> Ok
            </button>
          </div>
        ) : null}
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
                if (!this.verifyInput(roomName) || roomName.length < 2) {
                  this.allError(this.roomNameRef.current)
                  return
                }
                if (!this.verifyInput(password)) {
                  this.allError(this.passwordRef.current)
                  return
                }
                if (!this.verifyInput(userName) || userName.length < 2) {
                  this.allError(this.userNameRef.current)
                  return
                }
                this.outRoomScreen()
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
