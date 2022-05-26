import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app.js";
import { Provider } from "react-redux";
import reducer from "./redux/reducer";

import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";

import thunk from "redux-thunk";
import { init } from "./socket.js";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(immutableState.default(), thunk))
);
console.log("test");
// start.js
fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        console.log("data:", data.userId);
        if (!data.userId) {
            // this means the user does not have the right cookie -> show registration/login

            console.log("no userId");
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            init(store);
            console.log("there is a userId");
            // this means the user is logged in cause their browser has a cookie, yay. Not 100% save though.
            ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>,
                document.querySelector("main")
            );
        }
    })
    .catch((e) => {
        console.log("Catch in start.js fetch /user/id.json :", e);
    });
