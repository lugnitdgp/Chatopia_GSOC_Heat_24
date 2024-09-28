"use client";

import io from 'socket.io-client';

function getSocket() {
    const socket = io();
    socket.on('connect', () => {
    console.log("Connected from client: " , socket.id);
    });
    socket.on('disconnect', () => {
    console.log("Disconnected from client: " , socket.id);
    });
    return socket;
}

const socket = getSocket();

export default socket;