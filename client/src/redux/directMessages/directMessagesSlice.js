export default function directMessagesReducer(directMessages = [], action) {
    if (action.type == "directMessages/received") {
        return [...action.payload.messages.reverse(), ...directMessages];
    }

    if (action.type == "directMessages/NewMessage") {
        return [...directMessages, action.payload.message];
    }

    if (action.type == "directMessages/receiveInitialMessages") {
        return action.payload.messages;
    }

    return directMessages;
}

export function receiveNewDirectMessage(message) {
    return {
        type: "directMessages/NewMessage",
        payload: { message },
    };
}

export function receiveInitialMessages(messages) {
    return {
        type: "directMessages/receiveInitialMessages",
        payload: { messages },
    };
}

export function receiveDirectMessages(messages) {
    return {
        type: "directMessages/received",
        payload: { messages },
    };
}

export function getDirectMessages() {
    return function (dispatch, getState) {
        console.log("getDirectMessages is running");
        fetch("/API/directmessages")
            .then((result) => result.json())
            .then((result) => {
                if (!result.success) throw "No success fetch directmessages";

                console.log("directmessages result:", result);
                dispatch(receiveInitialMessages(result.data));
            })
            .catch((e) => {
                console.log("Error in directmessages-fetcher: ", e);
            });
    };
}
