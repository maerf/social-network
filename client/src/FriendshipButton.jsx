import { useEffect, useState } from "react";

const FriendshipButton = ({ otherUserId }) => {
    console.log("otherUserId: ", otherUserId);
    const [actionstring, setActionstring] = useState("");

    useEffect(() => {
        fetch("/API/GetFriendshipActionFor/" + otherUserId)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("FriendshipButton", data);
                if (data.success) {
                    setActionstring(data.action);
                }
            })
            .catch((e) => console.log("friendship mount fetch error", e));
    }, []);

    function handleFriendshipAction(e) {
        if (!otherUserId) console.log("no otherUserId!");

        fetch("/API/DoFriendshipAction/", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: actionstring, otherUserId }),
        })
            .then((resp) => resp.json())
            .then((obj) => {
                console.log("Post response", obj);
                if (obj.success) {
                    setActionstring(obj.action);
                }
            })
            .catch((e) => console.log("friendship mount fetch error", e));
    }
    return (
        <div>
            <a
                href="#"
                className="friendButtonLink"
                onClick={handleFriendshipAction}
            >
                {actionstring}
            </a>
        </div>
    );
};

export default FriendshipButton;
