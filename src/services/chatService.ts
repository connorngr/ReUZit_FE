import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';
import { addMessage, setConnectionStatus } from '../stores/chatSlice.ts';
import { Dispatch } from '@reduxjs/toolkit';

let stompClient: Client | null = null;

export const sendMessage = async (messageDTO: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!stompClient || !stompClient.connected) {
            console.error('STOMP client is not connected. Retrying...');
            throw new Error('STOMP client is not connected');
        }

        try {
            stompClient.publish({
                destination: '/app/send',
                body: JSON.stringify(messageDTO),
                headers: { 'content-type': 'application/json' },
            });
            resolve(messageDTO);
        } catch (error) {
            reject(error);
        }
    });
};

export const connectToChat = (dispatch: Dispatch): void => {
    dispatch(setConnectionStatus('connecting'));

    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
        dispatch(setConnectionStatus('connected'));

        stompClient?.subscribe('/topic/messages', (message) => {
            const receivedMessage = JSON.parse(message.body);
            dispatch(addMessage({ message: receivedMessage }));
        });
    };

    stompClient.onStompError = () => {
        dispatch(setConnectionStatus('disconnected'));
    };

    stompClient.activate();

};
