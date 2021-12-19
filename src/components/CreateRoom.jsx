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
    privateRoom: false,
    password: '',
    roomScreen: true,
    nameScreen: false,
    outFlag: false,
    inFlag: false,
    hideFlag: false
  }

  outRoomScreen = () => {
    this.setState({ roomScreen: true, outFlag: true })
    setTimeout(() => {
      this.setState({ roomScreen: false, outFlag: false })
      this.inNameScreen()
    }, inOutStyleData.duration)
  }

  inNameScreen = () => {
    this.setState({ nameScreen: true, inFlag: false, hideFlag: true })
    /*
      il y a un bug si commence l'annimation au moment ou l'element apparait
      donc 1ms de delay pour appliqué l'animation pour forcer le fait de la faire 
      en 2 render (1 pour l'apparition et 1 pour l'animation),
      comme on ne veux pas le voir sans le translate on le cache avec .hide
    */
    setTimeout(() => {
      this.setState({ inFlag: true, hideFlag: false })
    }, 1)
    setTimeout(() => {
      this.setState({ nameScreen: true, inFlag: false })
    }, inOutStyleData.duration + 1)
  }

  outNameScreen = () => {
    this.setState({ nameScreen: true, outFlag: true })
    setTimeout(() => {
      this.setState({ nameScreen: false, outFlag: false })
    }, inOutStyleData.duration)
  }

  handleSubmit = () => {
    const { roomName, password, userName, privateRoom } = this.state
    if (
      roomName.length > 0 &&
      (!privateRoom || (privateRoom && password && password.length > 0))
    ) {
      this.outNameScreen()
      axios
        .get(
          `/rooms/create?room_id=${roomName}&username=${userName}${
            privateRoom ? `&password=${password}` : ''
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
      privateRoom,
      password,
      roomScreen,
      nameScreen,
      userName,
      outFlag,
      inFlag,
      hideFlag,
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
            <span>Create Room</span>
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
            <div
              className="password-input"
              style={privateRoom ? { visibility: 'visible' } : { visibility: 'hidden' }}
            >
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
                if (
                  roomName.length > 0 &&
                  (!privateRoom || (privateRoom && password && password.length > 0))
                )
                  this.outRoomScreen()
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
            }${hideFlag ? ' hide' : ''}`}
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
              Create
            </button>
          </form>
        ) : null}
      </div>
    )
  }
}
