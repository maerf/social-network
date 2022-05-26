//exports.default = function (props)
export default function (props) {
    console.log(props);
    // of course doesn't work <img src="{props.imageUrl || './profile_dummy.png'}" />
    let img = props.image || "./profile_dummy.png";
    console.log("pics props", props);

    const avatarStyle = {
        height: "125px",
        width: "125px",
        objectFit: "cover",
        borderRadius: "50%",
        // border: "1px solid black",
        // margin: "10px",
    };

    return (
        <div className="profilePic">
            <img
                onClick={props.onImageClick}
                src={img}
                style={props.avatar ? avatarStyle : null}
            />
            {/* <img
                // onClick={props.profileImageClicked()}
                src={props.imageUrl || "./profile_dummy.png"}
            /> */}
        </div>
    );
}
