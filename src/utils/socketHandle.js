import io from 'socket.io-client'

const socket = io.connect('http://localhost:3002/', { transports: ['websocket'] })

export default class SocketHandle {
  constructor() {
    this.socket = socket
  }
  emit(event, data) {
    this.socket.emit(event, data)
  }
  on(event, callback) {
    this.socket.on(event, callback)
  }
}
