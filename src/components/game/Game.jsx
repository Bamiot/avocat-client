import React from 'react'
import '../../styles/game/game.scss'

import SocketHandle from '../../utils/socketHandle'

import Card from './Card'

export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props.gameState.state,
      actions: props.gameState.queue,
      username: props.username
    }
    this.socket = new SocketHandle()
  }

  sendAction = (action) => {
    this.socket.emit('avocat', { room: this.props, action })
  }

  cardClick(id, changeReveal, positionPath) {
    switch (positionPath) {
      case 'deck':
        // if il a le droit de pioché
        // this.sendAction({})
        break
      case 'pit':
        //
        break
      default:
        let player = positionPath.split('-')[0]
        let position = positionPath.split('-')[1]
        switch (position) {
          case 'hand':
            //
            break
          default:
            let index = parseInt(position)
            //
            break
        }
        break
    }
  }

  render() {
    const { action, pit } = this.state

    let players = this.state.players.slice()
    while (players[0].username !== this.state.username) {
      let p = players.shift()
      players.push(p)
    }

    return (
      <div className="game-container right-in">
        <button className="avocat-button">Avocat !</button>
        <Card
          className="card pit"
          id={pit.id || '00'}
          reveal={true}
          handleClick={(id, changeReveal) => {
            this.cardClick(id, changeReveal, `pit`)
          }}
        />
        <Card
          className="card deck"
          id={'00'}
          reveal={false}
          handleClick={(id, changeReveal) => {
            this.cardClick(id, changeReveal, `deck`)
          }}
        />
        <div
          className={`players count-${players.length}`}
          style={{ '--pc': players.length }}
        >
          {players.map((player, i) => (
            <div
              key={i}
              style={{
                '--p': i,
                '--ty': `${
                  Math.round(Math.cos((i * 2 * Math.PI) / players.length) * 100) / 100
                }`,
                '--tx': `${
                  Math.round(Math.sin((i * 2 * Math.PI) / players.length) * 100) / 100
                }`
              }}
              className={`player player-${i} ${
                player.username === this.state.username ? 'main-player' : 'other-player'
              }`}
            >
              <div className="player-name">{player.username}</div>
              <div className="player-cards">
                {player.cards.map((card, i) => (
                  <Card
                    key={i}
                    className={`card card-${i}`}
                    id={card.id}
                    reveal={false}
                    handleClick={(id, changeReveal) => {
                      this.cardClick(id, changeReveal, `${player.username}-${i}`)
                    }}
                  />
                ))}
              </div>
              <div className="player-hand">
                {
                  <Card
                    className="hand-card card"
                    id={player.hand.id || '00'}
                    reveal={true}
                    handleClick={(id, changeReveal) => {
                      this.cardClick(id, changeReveal, `${player.username}-hand`)
                    }}
                  />
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
