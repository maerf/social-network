import ProfilePic from "./profilePic";
import BioEditor from "./bioEditor";
import { useEffect, useState } from "react";

function Profile(props) {
    return (
        <div className="profile">
            <h3>
                {props.first} {props.last}
            </h3>

            <ProfilePic
                id={props.id}
                first={props.first}
                last={props.last}
                image={props.image}
                onImageClick={props.onImageClick}
            />
            <BioEditor bio={props.bio} setBio={props.setBio} />
        </div>
    );
}

export default Profile;
