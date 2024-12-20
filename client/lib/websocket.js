import useWebSocket from 'react-use-websocket';

import { toast } from 'react-toastify';

import { WS_SERVER_URL } from '@/globals';

export default function useDefaultWebsocket(path) {
    return useWebSocket(WS_SERVER_URL + path, {
        "fromSocketIO": false,
        "share": true,
        "onMessage": (event) => {
        },
        "onError": (event) => {
            console.log(event)
        },
        "onReconnectStop": (attempts) => {
            toast.error("Не удалось подключиться к серверу. Обновите страницу", {
                theme: "colored",
                autoClose: false,
                closeOnClick: false,
                closeButton: false
            })
        },
        "shouldReconnect": (event) => {
            return true
        },
        "reconnectInterval": 1000,
        "reconnectAttempts": 10,
        "retryOnError": true,
        "heartbeat":  false
    })
}