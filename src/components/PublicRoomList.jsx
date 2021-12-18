import react from 'react'
import axios from 'axios'
import '../styles/publicRoomList.scss'

export default class publicRoomList extends react.Component {
  state = {
    rooms: [
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
  }

  getRoomsList = () => {
    axios
      .get(`/rooms/publicRooms`)
      .then((res) => {
        console.log(res)
        this.setState({ rooms: res.data })
      })
      .catch((err) => console.log(err))
  }

  render() {
    const { rooms } = this.state
    return (
      <div className="publicroom-container">
        <span>Quick Join</span>
        <div className="publicroom-header">
          <p>Room name</p>
          <p>Players</p>
        </div>
        {rooms ? (
          <div className="scroll-view">
            {rooms.map((room, key) => (
              <div className="publicroom-card down-in" key={key}>
                <p>{room.id}</p>
                <p className={room.players < room.maxPlayers ? '' : 'text-red'}>
                  {room.players}/{room.maxPlayers}
                </p>
                <i
                  class={`fas fa-arrow-circle-right ${
                    room.players < room.maxPlayers ? 'text-green' : 'text-red'
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
