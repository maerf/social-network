import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProfilePic from "./profilePic";
import FriendshipButton from "./FriendshipButton";

function FindPeople({ id: userId }) {
    let [keyword, setKeyword] = useState("");
    let [userlist, setUserlist] = useState();
    let [title, setTitle] = useState();

    useEffect((e) => {
        console.log("useEffect-mounted fired, this should run once. arg:", e);

        const url = new URL("/users/", document.location);
        url.searchParams.append("filter", keyword);
        fetch(url)
            .then((result) => result.json())
            .then((result) => {
                console.log("FindPeople fetchresult: ", result);
                setUserlist(result.data);
            })
            .catch((e) => console.log("Problem fetching: ", e));
    }, []);

    useEffect(
        (e) => {
            if (!keyword) setTitle("Here are some of hour most recent users:");

            console.log("use effect fired, arg: ", e);
            console.log("Keyword:  ", keyword);

            const url = new URL("/users/", document.location);
            url.searchParams.append("filter", keyword);
            fetch(url)
                .then((result) => result.json())
                .then((result) => {
                    console.log("fetchresult: ", result);
                    setUserlist(result.data);

                    if (keyword && result.data.length)
                        setTitle(
                            `The names of these users match for "${keyword}"`
                        );
                    else if (keyword && !result.data.length)
                        setTitle(
                            `There are no Users matching your search for "${keyword}"`
                        );
                })
                .catch((e) => console.log("Problem fetching: ", e));
        },
        [keyword]
    );

    return (
        <div className="findPeople">
            <h3>{title}</h3>
            {userlist &&
                userlist.map((item) => {
                    return (
                        <div className="UserListItem" key={item.id}>
                            <Link to={"/users/" + item.id}>
                                <ProfilePic
                                    first={item.first}
                                    last={item.last}
                                    image={item.image_url}
                                ></ProfilePic>
                            </Link>
                            <div>
                                {/* {userId == item.id && (
                                    <div className="thisIsYou">
                                        (This is you!)
                                    </div>
                                )} */}
                                <h4>
                                    {userId == item.id && "You: "} {item.first}{" "}
                                    {item.last}{" "}
                                </h4>
                                <Link to={"/users/" + item.id}>
                                    View Profile
                                </Link>{" "}
                                {userId == item.id &&
                                    "(like others would see it)"}
                                {userId != item.id && (
                                    <FriendshipButton otherUserId={item.id} />
                                )}
                            </div>
                        </div>
                    );
                })}
            {!keyword && <p>Looking for somebody specific?</p>}
            <input
                placeholder="Enter Name to search"
                name="keyword"
                onChange={(e) => setKeyword(e.target.value)}
            />
        </div>
    );
}

export default FindPeople;
