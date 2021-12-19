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

export default class publicRoomList extends react.Component {
  state = {
    rooms: []
  }

  componentDidMount() {
    const intervalHandle = setInterval(this.getRoomsList, 1000)
    this.setState({ intervalHandle })
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

  // handleSubmit = () => {
  //   const { roomName, password, userName } = this.state
  //   if (roomName.length > 0) {
  //     this.outNameScreen()
  //     axios
  //       .get(
  //         `/rooms/join?room_id=${roomName}&username=${userName}${
  //           password.length > 0 ? `&password=${password}` : ''
  //         }`
  //       )
  //       .then((res) => {
  //         console.log(res)
  //       })
  //       .catch((err) => console.error(err))
  //   }
  // }

  render() {
    const { rooms } = this.state
    return (
      <div className="publicroom-container">
        <span>Quick Join</span>
        <div className="publicroom-header">
          <p>Room name</p>
          <p>Players</p>
        </div>
        {Array.isArray(rooms) ? (
          <div className="scroll-view">
            {rooms.map((room, key) => (
              <div className="publicroom-card down-in" key={key}>
                <p>{room.roomId}</p>
                <p className={room.players.length >= room.maxPlayers ? 'text-red' : ''}>
                  {room.players.length}/{room.maxPlayers}
                </p>
                <i
                  class={`fas fa-arrow-circle-right ${
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
    )
  }
}
