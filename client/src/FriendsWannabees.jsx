import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { receivedFriendsAndWannabees } from "./redux/friends/slice";
import { Link } from "react-router-dom";

import {
    makeFriend,
    makeUnfriend,
    GetFriendsWannabees,
} from "./redux/friends/slice";

const { FriendshipActions } = require("../../FriendshipActions");
import ProfilePic from "./profilePic";

export function FriendsWannabees() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(GetFriendsWannabees());
        // Code from before using redux Redux-Thunk as an exercise
        // console.log("FriendsWannabees is running");
        // fetch("/API/GetFriendsAndWannabies/")
        //     .then((result) => result.json())
        //     .then((result) => {
        //         if (!result.success) throw "No success";
        //         console.log("FriendsWannabees result:", result);

        //         dispatch(receivedFriendsAndWannabees(result.data));
        //     })
        //     .catch((e) => {
        //         console.log("Error in FriendsWannabees-fetcher: ", e);
        //     });
    }, []);

    const friends = useSelector((state) => {
        console.log("state", state);
        return (
            state.friendAndWannabees &&
            state.friendAndWannabees.filter((friend) => friend.accepted)
        );
    });

    const wannabees = useSelector((state) => {
        console.log("state", state);
        return (
            state.friendAndWannabees &&
            state.friendAndWannabees.filter((friend) => !friend.accepted)
        );
    });

    const handleUnfriend = (otherUserId) => {
        //do post reuqest, when positiv, actioncreator
        fetch("/API/DoFriendshipAction/", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: FriendshipActions.CancelFriendRequest,
                otherUserId,
            }),
        })
            .then((resp) => resp.json())
            .then((obj) => {
                console.log("Post response", obj);
                if (obj.success) {
                    dispatch(makeUnfriend(otherUserId));
                }
            })
            .catch((e) =>
                console.log("friendship handleUnfriend fetch error", e)
            );
    };

    const handleAccept = (otherUserId) => {
        fetch("/API/DoFriendshipAction/", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: FriendshipActions.AcceptFriendRequest,
                otherUserId,
            }),
        })
            .then((resp) => resp.json())
            .then((obj) => {
                console.log("Post response", obj);
                if (obj.success) {
                    dispatch(makeFriend(otherUserId));
                }
            })
            .catch((e) =>
                console.log("friendship handleAccept fetch error", e)
            );
    };

    return (
        <div>
            Friends:
            <div className="friendswannabees">
                {friends.map((friend) => {
                    return (
                        <div className="FriendListItem" key={friend.id}>
                            <div>
                                {friend.first} {friend.last}
                            </div>{" "}
                            <Link to={"/users/" + friend.id}>
                                <ProfilePic
                                    first={friend.first}
                                    last={friend.last}
                                    image={friend.image_url}
                                    avatar
                                ></ProfilePic>
                            </Link>
                            <div>
                                <button
                                    onClick={() => handleUnfriend(friend.id)}
                                >
                                    Unfriend
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <br />
            Wannabee-Friends:
            <div className="friendswannabees">
                {wannabees.map((friend) => {
                    return (
                        <div className="FriendListItem" key={friend.id}>
                            <div>
                                {friend.first} {friend.last}
                            </div>
                            <ProfilePic
                                first={friend.first}
                                last={friend.last}
                                image={friend.image_url}
                                avatar
                            ></ProfilePic>
                            <div>
                                <button onClick={() => handleAccept(friend.id)}>
                                    Accept Friendrequest
                                </button>
                            </div>
                        </div>
                    );
                })}
                <div className="FriendListItem item-empty"></div>
            </div>
        </div>
    );
}
