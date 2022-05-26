import { BrowserRouter, Route } from "react-router-dom";
import { Registration } from "./registration";
import { Login } from "./login";
import { ResetPassword } from "./resetPassword";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome!</h1>
            <img width="150" src="./logo1.png" />
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/resetpassword">
                        <ResetPassword />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}
