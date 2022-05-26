import { Component } from "react";
import { Link } from "react-router-dom";

export class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        console.log("Registration just mounted");
    }
    handleChange(evt) {
        console.log("user is typing in the input field :)");

        this.setState({
            [evt.target.name]: evt.target.value,
        });
    }
    handleSubmit(e) {
        console.log("user wants to send over data to the server & register");
        e.preventDefault();
        console.log("jsonstate", JSON.stringify(this.state));
        fetch("/login.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log("server response from POST /login.json", resp);
                if (resp.success) location.href = "/";
                else this.setState({ error: "Login error" });
            })
            .catch((err) => {
                console.log("err on fetch login.json", err);
                this.setState({ error: "Catch: Login error caught. Weird." });
            });
    }
    render() {
        return (
            <section>
                <h1 className="someClass">Please Login</h1>
                <form>
                    <input
                        name="email"
                        placeholder="Email"
                        type="email"
                        onChange={this.handleChange}
                    />
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={this.handleChange}
                    />
                    <button onClick={this.handleSubmit}>login</button>
                </form>
                {this.state.error && <h3>{this.state.error}</h3>}
                If you don't have an account, please go to{" "}
                <Link to="/">register</Link>
                <br />
                Click here if you{" "}
                <Link to="/ResetPassword">forgot your password.</Link>
            </section>
        );
    }
}
