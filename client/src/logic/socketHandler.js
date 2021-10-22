import {SOCKET_URL} from './../config'
import React from 'react'
import socketio  from 'socket.io-client'
export const socket = socketio.connect(SOCKET_URL);
export const SocketContext = React.createContext();