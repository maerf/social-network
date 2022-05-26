import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ProfilePic from "./profilePic";
import FriendshipButton from "./FriendshipButton";
import { socket } from "./socket.js";
import { toast } from "react-toastify";

function OtherProfile({ userId }) {
    const params = useParams();
    const [user, setUser] = useState();

    const [friends, setfriends] = useState();

    useEffect(() => {
        console.log("effect is running");
        fetch("/API/user/" + params.id)
            .then((result) => result.json())
            .then((row) => {
                console.log("otherprofile fetchresult: ", row);
                setUser(row.data);
                console.log("user downloaded:", user.data);
            })
            .catch((e) => {
                console.log("error in otherprofile: ", e);
            });

        fetch("/API/GetFriends/" + params.id)
            .then((result) => result.json())
            .then((row) => {
                console.log("otherprofile GetFriendsfetchresult: ", row);
                console.log("Other Profile GetFriends result:", row);
                setfriends(row.data);
            })
            .catch((e) => {
                console.log("error in GetFriends otherprofile: ", e);
            });
    }, [params]);

    const inputText = useRef();
    const handleKeyDown = (e) => {
        if (inputText.current.value && e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            socket.emit("directMessage", {
                from: userId,
                to: params.id,
                message: inputText.current.value,
            });
            inputText.current.value = "";
            toast("💬 Message sent!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    console.log("other profile query id", params.id);
    if (user && friends)
        return (
            <div className="otherPeopleProfile">
                <div>
                    <ProfilePic
                        first={user.first}
                        last={user.last}
                        image={user.image_url}
                        // onImageClick={props.onImageClick}
                    />
                    <h3>
                        {user.first} {user.last}
                    </h3>
                    <p>bio: {user.bio}</p>
                    {userId != user.id && (
                        <FriendshipButton otherUserId={user.id} />
                    )}
                    <br />
                    <br />
                    <textarea
                        className="dropLine"
                        ref={inputText}
                        onKeyDown={handleKeyDown}
                        placeholder="drop me a line"
                    ></textarea>

                    <p>Friends:</p>
                    <div className="otherProfileFriends">
                        {friends.map((friend) => {
                            return (
                                <div className="FriendListItem" key={friend.id}>
                                    <Link to={"/users/" + friend.id}>
                                        <ProfilePic
                                            first={friend.first}
                                            last={friend.last}
                                            image={friend.image_url}
                                            avatar
                                        ></ProfilePic>
                                        <div>
                                            {friend.first} {friend.last}
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    else return "";
}

export default OtherProfile;
