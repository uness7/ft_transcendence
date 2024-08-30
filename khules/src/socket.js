import io from 'socket.io-client';

const socket = io('http://10.12.4.6:4000'); // ca a l'air de marcher en local

socket.on('connect', () => {
    console.log('Successfully connected to the server!');
  });

export default socket;