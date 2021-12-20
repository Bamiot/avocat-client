import react from 'react'
import axios from 'axios'
import '../styles/publicRoomList.scss'

const placeholder = [
  {
    id: 'Johnny',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'John',
    players: 4,
    maxPlayers: 4
  },
  {
    id: 'JohnyJohnyJohnyJohnyJohnyJohnyJohnyJohnyJohny',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'John',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'Johny',
    players: 4,
    maxPlayers: 4
  },
  {
    id: 'John',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'Johny',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'John',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'Johny',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'John',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'Johny',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'John',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'Johny',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'John',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'Johny',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'John',
    players: 2,
    maxPlayers: 4
  },
  {
    id: 'Johny',
    players: 2,
    maxPlayers: 4
  }
]

const inOutStyleData = {
  duration: 500
}

const inOutStyle = {
  animationDuration: `${inOutStyleData.duration}ms`
}

export default class publicRoomList extends react.Component {
  constructor(props) {
    super(props)
    this.state = {
      rooms: [],
      roomScreen: true,
      nameScreen: false,
      errorScreen: false,
      inFlag: false,
      outFlag: false,
      username: '',
      intervalHandle: null
    }
    this.userNameRef = react.createRef()
  }

  componentDidMount() {
    const intervalHandle = setInterval(this.getRoomsList, 10 * 1000)
    this.setState({ intervalHandle })
    this.getRoomsList()
  }

  componentWillUnmount() {
    const { intervalHandle } = this.state
    clearInterval(intervalHandle)
  }

  getRoomsList = () => {
    axios
      .get(`/rooms/publicRooms`)
      .then((res) => {
        console.log(res)
        this.setState({ rooms: res.data.rooms })
      })
      .catch((err) => console.log(err))
  }

  outRoomScreen = () => {
    this.setState({ outFlag: true })
    setTimeout(() => {
      this.setState({ roomScreen: false, outFlag: false })
      this.inNameScreen()
    }, 500)
  }

  inNameScreen = () => {
    this.setState({ nameScreen: true, inFlag: true })
    setTimeout(() => {
      this.setState({ inFlag: false })
    }, 500)
  }

  outNameScreen = () => {
    this.setState({ nameScreen: true, outFlag: true })
    setTimeout(() => {
      this.setState({ nameScreen: false, outFlag: false })
    }, 500)
  }

  inRoomScreen = () => {
    this.setState({ roomScreen: true, inFlag: true })
    setTimeout(() => {
      this.setState({ inFlag: false })
    }, 500)
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
    const { roomName, username } = this.state
    console.log(roomName, username)

    if (roomName.length > 0) {
      this.outNameScreen()
      axios
        .get(`/rooms/join?room_id=${roomName}&username=${username}`)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.error(err)
          console.error(err.response)
          this.inErrorScreen(err.response.data.error)
        })
    }
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

  returnAction = () => {
    this.outNameScreen()
    setTimeout(() => {
      this.inRoomScreen()
    }, 500)
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
    const { rooms, roomScreen, nameScreen, errorScreen, inFlag, outFlag, username } =
      this.state
    return (
      <div className="publicroom-container">
        <span>
          Quick Join
          <i
            className="fas fa-sync-alt"
            onClick={(e) => {
              e.preventDefault()
              this.setState({ rooms: [] })
              setTimeout(this.getRoomsList, 1000)
            }}
          />
        </span>
        {errorScreen ? (
          <div
            className={`errorScreenPublic ${inFlag ? ' right-in' : ''}${
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
              {' '}
              Ok
            </button>
          </div>
        ) : null}
        {roomScreen || nameScreen || errorScreen ? null : (
          <div className="loading-spinner" />
        )}
        {roomScreen ? (
          <div
            className={`scroll-view-wrapper ${outFlag ? ' left-out' : ''}${
              inFlag ? ' left-in' : ''
            }`}
          >
            <div className="publicroom-header">
              <p>Room name</p>
              <p>Players</p>
            </div>
            {roomScreen && Array.isArray(rooms) && rooms.length > 0 ? (
              <div className="scroll-view">
                {rooms.map((room, key) => (
                  <div
                    className="publicroom-card down-in"
                    key={key}
                    onClick={(e) => {
                      e.preventDefault()
                      if (room.players.length < room.maxPlayers) {
                        this.outRoomScreen()
                        this.setState({ roomName: room.roomId })
                      }
                    }}
                  >
                    <p>{room.roomId}</p>
                    <p
                      className={room.players.length >= room.maxPlayers ? 'text-red' : ''}
                    >
                      {room.players.length}/{room.maxPlayers}
                    </p>
                    <i
                      className={`fas fa-arrow-circle-right ${
                        room.players.length < room.maxPlayers ? 'text-green' : 'text-red'
                      }`}
                    ></i>
                  </div>
                ))}
              </div>
            ) : (
              <div className="loading-spinner" />
            )}
          </div>
        ) : null}
        {nameScreen ? (
          <form
            className={`name-screen ${inFlag ? ' right-in' : ''}${
              outFlag ? ' right-out' : ''
            }`}
          >
            <i className="fas fa-arrow-left return-btn" onClick={this.returnAction}></i>
            <span>Enter Name :</span>
            <br />
            <input
              type="text"
              placeholder="name"
              value={username}
              ref={this.userNameRef}
              onChange={(e) => {
                if (this.verifyName(e.target.value))
                  this.setState({ username: e.target.value })
                else this.shakeError(e.target)
              }}
            />
            <br />
            <button
              onClick={(e) => {
                e.preventDefault()
                if (!this.verifyName(username) || username.length < 2)
                  this.allError(this.userNameRef.current)
                else this.handleSubmit()
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
