//socket service to handle socket connection and events

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:4001'

let socket = null;

 export function connectSocket() {
  socket = new WebSocket(WS_URL);
  socket.onopen = () => console.log('WebSocket connected');
  socket.onclose = () => console.log('WebSocket disconnected');
  socket.onerror = (error) => console.error('WebSocket error:', error);
}

export function onSOSActive(callback){
    if(!socket) return;
    socket.onmessage = (event) => {
        const data =JSON.parse(event.data);
        if(data.type === 'SOS_ACTIVE') callback(data);

    };
}
export function disconnectSocket(){
    if(socket){socket.close(); socket = null;}
}