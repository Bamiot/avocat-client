import React from 'react'
import '../../styles/game/game.scss'

import Card from './Card'

export default class Room extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameState: props.gameState
    }
  }
  render() {
    return (
      <div className="game-container right-in">
        <Card
          id="AH"
          reveal={true}
          handleClick={() => {
            console.log(arguments)
          }}
        />
      </div>
    )
  }
}
