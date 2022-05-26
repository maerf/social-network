import {
    receiveLastMessages,
    receiveNewRoomMessage,
} from "./redux/messages/messagesSlice";

import { receiveNewDirectMessage } from "./redux/directMessages/directMessagesSlice";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

export let socket;

export const init = (store) => {
    console.log("init called");
    if (!socket) {
        socket = io.connect();

        console.log("Client socket is: ", socket);

        socket.on("LastMessages", (msgs) => {
            console.log("LastMessages:", msgs);
            store.dispatch(receiveLastMessages(msgs));
        });

        socket.on("newDirectMessage", (msg) => {
            console.log("newDirectMessage received:", msg);
            const oldTitle = document.title;
            document.title = "New message";
            toast(msg.first + " " + msg.last + " says: " + msg.message);
            setTimeout(() => {
                document.title = oldTitle;
            }, 2000);
            store.dispatch(receiveNewDirectMessage(msg));
        });

        socket.on("DirectMessageMyCopy", (msg) => {
            console.log("newDirectMessageCopy received:", msg);
            const oldTitle = document.title;
            store.dispatch(receiveNewDirectMessage(msg));
        });

        socket.on("NewRoomMessage", (msgs) => {
            console.log("NewRoomMessage received:", msgs);
            store.dispatch(receiveNewRoomMessage(msgs));
        });
    }
};
