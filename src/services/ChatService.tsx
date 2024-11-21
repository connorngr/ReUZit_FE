import SockJS from 'sockjs-client';
import { Client, Frame } from '@stomp/stompjs';
import { Dispatch } from 'redux';
import { addMessage, setConnectionStatus } from '../components/store/chatSlice';

interface MessageDTO {
    id?: string;
    content: string;
    sender?: string;
    timestamp?: Date;
    // thêm các trường khác nếu cần
}

let stompClient: Client | null = null;

const RETRY_DELAY: number = 2000;
const MAX_RETRIES: number = 3;

export const connectToChat = (dispatch: Dispatch): void => {
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
            const receivedMessage: MessageDTO = JSON.parse(message.body);
            dispatch(addMessage({message: receivedMessage}));
        });
    };

    stompClient.onStompError = (frame: Frame) => {
        console.error('STOMP error:', frame);
        dispatch(setConnectionStatus('error'));
    };

    stompClient.activate();
};

export const disconnectFromChat = (): void => {
    if (stompClient) {
        stompClient.deactivate();
    }
};

export const sendMessage = async (messageDTO: MessageDTO): Promise => {
    if (!stompClient?.connected) {
        throw new Error('Not connected to chat server');
    }

    return new Promise((resolve, reject) => {
        stompClient?.publish({
            destination: '/app/send',
            body: JSON.stringify(messageDTO),
            headers: {'content-type': 'application/json'},
        });
        resolve(messageDTO);
    });
};

export const checkConnection = async (username: string, dispatch: Dispatch): Promise => {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            if (!stompClient?.connected) {
                connectToChat(dispatch);
            }
            return true;
        } catch (error) {
            console.error(`Connection attempt ${retries + 1} failed:`, error);
            retries++;

            if (retries < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
            }
        }
    }

    throw new Error('Failed to establish connection after multiple attempts');
};