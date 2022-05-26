import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDirectMessages } from "./redux/directMessages/directMessagesSlice";
import { socket } from "./socket";

const Messages = ({ userId }) => {
    const dispatch = useDispatch();
    const inputText = useRef();

    useEffect(() => {
        dispatch(getDirectMessages());
    }, []);

    const [conversationIndex, setConversationIndex] = useState(0);
    const [conversationUserId, setConversationUserId] = useState();

    const directMessages = useSelector((state) => {
        console.log("state", state);
        return state.directMessages;
    });

    useEffect(() => {
        updateGroups();
    }, [directMessages]);

    let groups = {}; //[]; {}; [null]
    updateGroups();
    function updateGroups() {
        directMessages.forEach((message) => {
            if (message.sender_id == userId && message.recipient_id !== userId)
                if (groups[message.recipient_id])
                    groups[message.recipient_id].messages.push(message);
                else
                    groups[message.recipient_id] = {
                        data: {
                            name: message.recipient_name,
                            image: message.recipient_img,
                        },
                        messages: [message],
                    };
            else if (
                message.sender_id !== userId &&
                message.recipient_id !== userId
            ) {
                console.log(`else if entered: message.sender_id !== userId &&
                message.recipient_id !== userId`);
                if (groups[message.sender_id])
                    groups[message.sender_id].messages.push(message);
                else
                    groups[message.sender_id] = {
                        data: {
                            name: message.sender_name,
                            image: message.sender_img,
                        },
                        messages: [message],
                    };
            } else if (groups[message.sender_id])
                groups[message.sender_id].messages.push(message);
            else
                groups[message.sender_id] = {
                    data: {
                        name: message.sender_name,
                        image: message.sender_img,
                    },
                    messages: [message],
                };
        });
        console.log("useEffec ran");
    }

    console.log("groups:", groups);
    console.log("Object.entries(groups) :", Object.entries(groups));
    Object.entries(groups).forEach((entry) => {
        console.log("eintrag", entry[0]);
    });

    if (Object.entries(groups)[0]) {
        console.log(
            "Object.entries(groups)[0][1]",
            Object.entries(groups)[0][1]
        );
    }

    const handleKeyDown = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            socket.emit("directMessage", {
                from: userId,
                to: conversationUserId,
                message: inputText.current.value,
            });
            inputText.current.value = "";
        }
    };

    function handleConversationChange(newIndex, newUserId) {
        setConversationIndex(newIndex);
        setConversationUserId(newUserId);
    }

    return (
        <section>
            <h1>Direct Messages</h1>
            <div className="directMessagesWrappen">
                <div className="directMessagesLeftRightWrapper">
                    <div className="directmessagesPeople">
                        {Object.entries(groups).map((item, index) => {
                            console.log("item", item);
                            return (
                                <div key={item[0]}>
                                    <div>
                                        <img
                                            onClick={() =>
                                                handleConversationChange(
                                                    index,
                                                    item[0]
                                                )
                                            }
                                            className="chatPicture"
                                            alt={item[1].data.name}
                                            src={item[1].data.image}
                                        ></img>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="directMessagesVerticalWrapper">
                        <div className="chatContainer">
                            {groups &&
                                Object.entries(groups)[conversationIndex] &&
                                Object.entries(groups)[
                                    conversationIndex
                                ][1].messages.map((msg) => {
                                    return (
                                        <div
                                            className={
                                                msg.sender_id == userId
                                                    ? "chatListItem reversed"
                                                    : "chatListItem"
                                            }
                                            key={msg.id}
                                        >
                                            <div className="debug">
                                                #{msg.id}
                                            </div>
                                            <img
                                                className="chatPicture"
                                                src={msg.image_url}
                                            ></img>
                                            <div className="chatListItem columRight">
                                                <div>
                                                    {msg.first} {msg.last}{" "}
                                                    {new Date(
                                                        msg.created_at
                                                    ).toLocaleString()}
                                                </div>
                                                <div>{msg.message}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        <textarea
                            className="chatTextFieldWrapper"
                            ref={inputText}
                            onKeyDown={handleKeyDown}
                            placeholder="Chime in!"
                        ></textarea>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Messages;
