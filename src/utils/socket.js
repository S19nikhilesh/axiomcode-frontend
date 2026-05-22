import { io } from 'socket.io-client';


const BACKEND_URL = 'http://localhost:3000'; 


const socket = io(BACKEND_URL, {
    autoConnect: true,       
    reconnection: true,      
    reconnectionAttempts: 5  
});


socket.on('connect', () => {
    console.log('Frontend global socket connected successfully! ID:', socket.id);
});

export default socket;