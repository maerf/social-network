import { Component } from "react";
import { Link } from "react-router-dom";

export class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            error: "",
            resetStep: 0,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitCode = this.submitCode.bind(this);
    }
    componentDidMount() {
        console.log("Pw-Reset just mounted");
    }
    handleChange(evt) {
        console.log("user is typing in the input field :)");

        this.setState({
            [evt.target.name]: evt.target.value,
        });
    }
    handleSubmit(e) {
        e.preventDefault();

        console.log("jsonstate", JSON.stringify(this.state));
        fetch("/pwrCheckEmail.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log(
                    "server response from POST /pwrCheckEmail.json",
                    resp
                );
                if (resp.success) {
                    this.setState({ resetStep: 1 });
                } else this.setState({ error: "Registration Error" });
            })
            .catch((err) => {
                console.log("Password reset error caught. Weird.", err);
                this.setState({ error: "Password reset error caught. Weird." });
            });
    }

    submitCode(e) {
        e.preventDefault();
        console.log("jsonstate", JSON.stringify(this.state));
        fetch("/pwrReceiveCode.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log(
                    "server response from POST /pwrReceiveCode.json",
                    resp
                );
                if (resp.success)
                    this.setState({ resetStep: 2 }); //location.reload();
                else
                    this.setState({
                        error: "The code you provided was wrong, or an error occurred. Please request a new code.",
                    });
            })
            .catch((err) => {
                console.log("Password reset error caught. Weird.", err);
                this.setState({ error: "Password reset error caught. Weird." });
            });
    }
    render() {
        if (this.state.resetStep == 0) {
            return (
                <section>
                    <h1 className="someClass">Reset Password</h1>
                    <h4 className="someClass">
                        Please enter your email address to begin the password
                        reset process
                    </h4>
                    <form>
                        <input
                            name="email"
                            placeholder="Email"
                            type="email"
                            onChange={this.handleChange}
                        />

                        <button onClick={this.handleSubmit}>
                            Receive verification code
                        </button>
                    </form>
                    <Link to="/login">Click here to go back to Log in</Link>
                    {this.state.error && <h2>{this.state.error}</h2>}
                </section>
            );
        } else if (this.state.resetStep == 1) {
            return (
                <section>
                    <h4>
                        If the email address you have provided exists, you
                        should have received a code to reset your password.
                    </h4>
                    <input
                        name="newPassword"
                        placeholder="Password"
                        type="password"
                        onChange={this.handleChange}
                    />

                    <input
                        name="code"
                        placeholder="paste the reset code here"
                        type="text"
                        onChange={this.handleChange}
                    />
                    <button onClick={this.submitCode}>submit code</button>
                    {this.state.error && <h2>{this.state.error}</h2>}
                </section>
            );
        } else if (this.state.resetStep == 2) {
            return (
                <section>
                    <h4>You have successfully reset your password.</h4>
                    <Link to="/login">Click here to log in</Link>
                    {this.state.error && <h2>{this.state.error}</h2>}
                </section>
            );
        }
    }
}
