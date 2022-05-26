import { Component } from "react";

export class BioEditor extends Component {
    constructor() {
        super();
        this.state = {
            error: "",
            editingMode: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        console.log("BioEdit just mounted");
    }
    handleChange(e) {
        console.log("bio changed ", e);
        this.setState({ bio: e.target.value });
    }
    handleSubmit() {
        const route = "/profile/updateBio";

        console.log("bio save clicked");
        console.log("state", this.state);

        console.log("jsonstate", JSON.stringify(this.state));
        fetch(route, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log("server response from POST " + route, resp);
                if (resp.success) {
                    console.log("bio response successful");
                    this.props.setBio(this.state.bio);
                    this.setState({ editingMode: false });
                    console.log("stat after editing: ", this.state);
                }
                //location.reload();
                else this.setState({ error: "Error saving bio" });
            })
            .catch((err) => {
                console.log("err on fetch " + route, err);
                this.setState({ error: "Error saving bio (2)" });
            });
    }

    handleBioSave() {}

    render() {
        if (this.state.editingMode) {
            return (
                <div>
                    <textarea
                        defaultValue={this.props.bio}
                        onChange={this.handleChange}
                    />
                    <button onClick={this.handleSubmit}>save</button>
                </div>
            );
        } else if (!this.props.bio) {
            return (
                <h4>
                    <button
                        onClick={() => this.setState({ editingMode: true })}
                    >
                        Add a bio
                    </button>
                </h4>
            );
        } else if (this.props.bio) {
            return (
                <div>
                    {this.props.bio}
                    <button
                        onClick={() => this.setState({ editingMode: true })}
                    >
                        edit
                    </button>
                </div>
            );
        }
    }
}

export default BioEditor;
