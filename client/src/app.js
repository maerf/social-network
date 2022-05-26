import React from "react";
import ProfilePic from "./profilePic";
import { Uploader } from "./uploader";
import Profile from "./Profile";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import FindPeople from "./FindPeople";
import OtherProfile from "./OtherProfile";
import FunctionalTypescript from "./FunctionalTypescript";
import { FriendsWannabees } from "./FriendsWannabees";
import { Chat } from "./chat";
import Messages from "./Messages";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        fetch("/user")
            .then((res) => res.json())
            .then((data) => {
                console.log("/User received: ", data);
                this.setState({ ...data.user });
            })
            .catch((e) => {
                console.log("Error in Fetch /User ", e);
            });
    }

    setBio(newBio) {
        this.setState({ bio: newBio });
    }

    render() {
        if (!this.state.id) {
            return <img src="spinner.gif" alt="Loading..." />;
        }
        console.log("State on App load:", this.state);
        return (
            <div className="app">
                {}
                <ToastContainer
                    position="bottom-right"
                    autoClose={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                />
                <BrowserRouter>
                    <div id="nav">
                        {" "}
                        <Link to="/">Profile</Link>{" "}
                        <Link to="/users/findPeople">Search</Link>{" "}
                        <Link to="/Friends">Friends</Link>
                        <Link to="/chat">Chat</Link>
                        <Link to="/messages">Messages</Link>
                        <a href="/clear">Logout</a>
                        <Link to="/TypeScript">i</Link>
                    </div>

                    <Switch>
                        <Route exact path="/">
                            <Profile
                                id={this.state.id}
                                first={this.state.first}
                                last={this.state.last}
                                image={this.state.image_url}
                                onImageClick={() =>
                                    this.setState({
                                        uploaderIsVisible: this.state
                                            .uploaderIsVisible
                                            ? false
                                            : true,
                                    })
                                }
                                bio={this.state.bio}
                                setBio={(bio) => this.setBio(bio)}
                            />
                        </Route>
                        <Route path="/users/findPeople">
                            <FindPeople id={this.state.id} />
                        </Route>
                        <Route path="/users/:id">
                            <OtherProfile userId={this.state.id} />
                        </Route>
                        <Route path="/friends">
                            <FriendsWannabees />
                        </Route>
                        <Route path="/chat">
                            <Chat userId={this.state.id} />
                        </Route>
                        <Route path="/messages">
                            <Messages userId={this.state.id} />
                        </Route>
                        <Route path="/TypeScript">
                            <FunctionalTypescript userId={this.state.id} />
                        </Route>
                    </Switch>
                </BrowserRouter>

                {}

                <ProfilePic
                    image={this.state.image_url}
                    onImageClick={() =>
                        this.setState({
                            uploaderIsVisible: this.state.uploaderIsVisible
                                ? false
                                : true,
                        })
                    }
                />
                {this.state.uploaderIsVisible && <Uploader />}
            </div>
        );
    }
}
