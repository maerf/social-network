import { Component } from "react";
import { Link } from "react-router-dom";

export class Registration extends Component {
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
        fetch("/register.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log("server response from POST /register.json", resp);
                if (resp.success) location.reload();
                else this.setState({ error: "Registration Error" });
            })
            .catch((err) => {
                console.log("err on fetch register.json", err);
                this.setState({ error: "Registration error caught. Weird." });
            });
    }
    render() {
        return (
            <section>
                <h1 className="someClass">Registration</h1>

                <form>
                    <input
                        name="first"
                        placeholder="First Name"
                        type="text"
                        onChange={(evt) => this.handleChange(evt)}
                    />
                    <input
                        name="last"
                        placeholder="Last Name"
                        type="text"
                        onChange={this.handleChange}
                    />
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
                    <button onClick={this.handleSubmit}>register</button>
                </form>
                {this.state.error && <h2>{this.state.error}</h2>}
                <Link to="/login">Click here to Log in</Link>
            </section>
        );
    }
}
