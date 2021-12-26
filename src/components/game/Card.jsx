import React from 'react'
import '../../styles/game/card.scss'

const prelinkCards =
  'https://raw.githubusercontent.com/benoitgoussier/playingcards/main/PNG/'
const backLink =
  'https://raw.githubusercontent.com/benoitgoussier/playingcards/main/PNG/purple_back.png'

class Card extends React.Component {
  state = {
    id: this.props.id,
    reveal: this.props.reveal,
    handleClick: this.props.handleClick
  }

  changeReveal = (isReveal) => {
    let revealState = this.state.isReveal
    if (isReveal === undefined) {
      revealState = !this.state.isReveal
      this.setState({ isReveal: revealState })
    }
    if (typeof isReveal === 'boolean') {
      revealState = isReveal
      this.setState({ isReveal: revealState })
    }
    return revealState
  }

  render() {
    const { reveal, id, handleClick } = this.state
    const imageLink = prelinkCards + id + '.png'
    return (
      <img
        className="card-img"
        src={reveal ? imageLink : backLink}
        alt="card"
        onClick={() => {
          handleClick(id, this.changeReveal)
        }}
      />
    )
  }
}

export default Card
