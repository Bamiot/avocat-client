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

    let username = ''
    if (props.username) username = props.username

    this.state = {
      roomName: '',
      username: username,
      privateRoom: false,
      password: '',
      roomScreen: true,
      nameScreen: false,
      errorScreen: false,
      outFlag: false,
      inFlag: false,
      hideFlag: false,
      maxPlayers: 4
    }
    this.roomNameRef = react.createRef()
    this.userNameRef = react.createRef()
    this.passwordRef = react.createRef()
    this.maxPlayersRef = react.createRef()
  }

  inRoomScreen = () => {
    this.setState({ roomScreen: true, inFlag: true })
    setTimeout(() => {
      this.setState({ roomScreen: true, inFlag: false })
    }, inOutStyleData.duration)
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
    const { roomName, password, username, privateRoom, maxPlayers } = this.state
    if (
      roomName.length > 0 &&
      (!privateRoom || (privateRoom && password && password.length > 0))
    ) {
      this.outNameScreen()
      axios
        .get(
          `/rooms/create?room_id=${roomName}&maxplayers=${maxPlayers}&username=${username}${
            privateRoom ? `&password=${password}` : ''
          }`
        )
        .then((res) => {
          console.log(res)
          this.props.onJoin(roomName, username)
        })
        .catch((err) => {
          console.error(err)
          console.error(err.response)
          this.inErrorScreen(err.response.data.error)
        })
    } else console.error('create room handle sumbit error')
  }

  verifyName = (value) => {
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

  verifyPlayerNumber = (value) => {
    return (value > 0 && value <= 12) || value === ''
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
      privateRoom,
      password,
      roomScreen,
      nameScreen,
      errorScreen,
      username,
      outFlag,
      inFlag,
      hideFlag,
      showPassword,
      maxPlayers
    } = this.state
    return (
      <div className="joinCreateRoom-container createRoom">
        {roomScreen || nameScreen || errorScreen ? null : (
          <div className="loading-spinner" />
        )}
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
            className={`joinCreateRoom${outFlag ? ' left-out' : ''}${
              inFlag ? ' left-in' : ''
            }`}
            style={inOutStyle}
          >
            <span>Create Room</span>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              ref={this.roomNameRef}
              onChange={(e) => {
                e.preventDefault()
                if (this.verifyName(e.target.value))
                  this.setState({ roomName: e.target.value })
                else this.shakeError(e.target)
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
                ref={this.passwordRef}
                onChange={(e) => {
                  e.preventDefault()
                  if (this.verifyName(e.target.value))
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
            <div className="maxplayers-container">
              <label htmlFor="maxplayer-input">Max players : </label>
              <input
                type="number"
                id="maxplayers-input"
                value={maxPlayers}
                ref={this.maxPlayersRef}
                onChange={(e) => {
                  e.preventDefault()
                  if (this.verifyPlayerNumber(e.target.value))
                    this.setState({ maxPlayers: e.target.value })
                  else this.shakeError(e.target)
                }}
              />
              <i
                className="fas fa-caret-up spin-btn-up"
                onClick={(e) => {
                  const maxPlayers = this.maxPlayersRef.current.value
                  if (maxPlayers < 12)
                    this.setState({ maxPlayers: parseInt(maxPlayers) + 1 })
                }}
              />
              <i
                className="fas fa-caret-down spin-btn-down"
                onClick={(e) => {
                  const maxPlayers = this.maxPlayersRef.current.value
                  if (maxPlayers > 2)
                    this.setState({ maxPlayers: parseInt(maxPlayers) - 1 })
                }}
              />
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                if (!this.verifyName(roomName) || roomName.length < 2) {
                  this.allError(this.roomNameRef.current)
                  return
                }
                if (!this.verifyPlayerNumber(maxPlayers) || maxPlayers < 2) {
                  this.allError(this.maxPlayersRef.current)
                }
                if (privateRoom && !this.verifyName(password)) {
                  this.allError(this.passwordRef.current)
                  return
                }
                if (privateRoom && password.length < 4) {
                  this.allError(this.passwordRef.current)
                  return
                }
                if (privateRoom && password.length > 30) {
                  this.allError(this.passwordRef.current)
                  return
                }
                this.outRoomScreen()
              }}
            >
              Ok <i className="fas fa-angle-right"></i>
            </button>
          </form>
        ) : null}
        {nameScreen ? (
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
              value={username}
              ref={this.userNameRef}
              onChange={(e) => {
                if (this.verifyName(e.target.value))
                  this.setState({ username: e.target.value })
                else this.shakeError(e.target)
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault()
                if (!this.verifyName(username) || username.length < 2)
                  this.allError(this.userNameRef.current)
                else this.handleSubmit()
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
