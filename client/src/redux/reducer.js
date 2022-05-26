import { combineReducers } from "redux";
import friendsReducer from "./friends/slice";
import messagesReducer from "./messages/messagesSlice";
import directMessagesReducer from "./directMessages/directMessagesSlice";

const rootReducer = combineReducers({
    friendAndWannabees: friendsReducer,
    messages: messagesReducer,
    directMessages: directMessagesReducer,
});

export default rootReducer;
