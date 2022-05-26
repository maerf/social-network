export default function friends(friendAndWannabees = [], action) {
    console.log("friends:", friendAndWannabees);

    if (action.type == "friends-wannabees/received") {
        return (friendAndWannabees = action.payload.friendAndWannabees);
    }

    if (action.type === "friends-wannabees/accept") {
        return (friendAndWannabees = friendAndWannabees.map((friend) =>
            friend.id == action.payload.id
                ? { ...friend, accepted: true }
                : friend
        ));
    }

    if (action.type === "friends-wannabees/unfriend") {
        return friendAndWannabees.filter(
            (friend) => friend.id != action.payload.id
        );
    }

    return friendAndWannabees;
}

export function makeFriend(id) {
    return {
        type: "friends-wannabees/accept",
        payload: { id },
    };
}

export function makeUnfriend(id) {
    fetch("https://www.heise.de").then((res) => console.log("heise yay", res));
    console.log("makeunfriend", id);
    return {
        type: "friends-wannabees/unfriend",
        payload: { id },
    };
}

export function receivedFriendsAndWannabees(friendAndWannabees) {
    return {
        type: "friends-wannabees/received",
        payload: { friendAndWannabees },
    };
}

export function GetFriendsWannabees() {
    return function (dispatch, getState) {
        console.log("FriendsWannabees is running");
        fetch("/API/GetFriendsAndWannabies/")
            .then((result) => result.json())
            .then((result) => {
                if (!result.success) throw "No success";

                console.log("GetFriendsWannabees result:", result);
                dispatch(receivedFriendsAndWannabees(result.data));
            })
            .catch((e) => {
                console.log("Error in FriendsWannabees-fetcher: ", e);
            });
    };
}
