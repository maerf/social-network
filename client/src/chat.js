import { useSelector } from "react-redux";
import { socket } from "./socket.js";
import { useRef } from "react";

export function Chat(props) {
    const messages = useSelector((state) => {
        console.log("state", state);
        return state.messages; //&& state.friendAndWannabees.filter((friend) => friend.accepted)
    });

    const handleSubmit = () => {
        console.log("handlesubmit called");
        sendMessage();
    };

    const sendMessage = () => {
        const str = inputText.current.value;
        console.log("sending message:", str);

        let match = null;
        if (str.startsWith(`\\`)) {
            const rx = /\\@([0-9]+) ((\w?\W?)*)/;

            match = str.match(rx);
            if (match) {
                console.log("match: ", match);
                socket.emit("directMessage", {
                    from: props.userId,
                    to: match[1],
                    message: match[2],
                });
                inputText.current.value = "";
            }
        } else {
            console.log(socket.emit("message", inputText.current.value));
            inputText.current.value = "";
        }
    };

    const handleKeyDown = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleMore = () => {
        console.log("handlemore called, id:", messages[0].id);
        socket.emit("chat/getMore", messages[0].id);
    };

    const messagesContainer = useRef();
    const inputText = useRef();

    // useEffect(() => {
    //     messagesContainer.current.scrollTop = /* scrollHeight clientHeight */
    // }, [messages]);
    // };

    return (
        <section>
            <h1>Chat!</h1>
            <button onClick={(e) => handleMore(e)}>more</button>
            {messages &&
                messages.map((msg) => {
                    return (
                        <div className="chatListItem" key={msg.id}>
                            <div className="debug"> #{msg.id}</div>
                            <img
                                className="chatPicture"
                                src={msg.image_url}
                            ></img>
                            <div className="chatListItem columRight">
                                <div>
                                    {msg.first} {msg.last}{" "}
                                    {new Date(msg.created_at).toLocaleString()}
                                </div>
                                <div>{msg.message}</div>
                            </div>
                        </div>
                    );
                })}
            <section ref={messagesContainer}></section>
            <textarea
                ref={inputText}
                onKeyDown={handleKeyDown}
                placeholder="Chime in!"
            ></textarea>
            <button onClick={(e) => handleSubmit(e)}>Send</button>
        </section>
    );
}
