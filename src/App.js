// import
import React from 'react'

import './styles/app.scss'

// components
import CreateRoom from './components/CreateRoom'

export default class App extends React.Component {
  state = {}

  componentDidMount = () => {}

  render = () => {
    // const {} = this.state
    return (
      <div className="App">
        <CreateRoom />
      </div>
    )
  }
}
