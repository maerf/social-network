export default function messagesReducer(messages = [], action) {
    console.log("messagesReducer messages:", messages);

    if (action.type == "messages/received") {
        return [...action.payload.messages.reverse(), ...messages];
    }

    if (action.type == "messages/NewRoomMessage") {
        return [...messages, action.payload.message];
    }

    return messages;
}

export function receiveLastMessages(messages) {
    return {
        type: "messages/received",
        payload: { messages },
    };
}

export function receiveNewRoomMessage(message) {
    return {
        type: "messages/NewRoomMessage",
        payload: { message },
    };
}
