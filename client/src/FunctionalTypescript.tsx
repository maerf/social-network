import { useState, useEffect } from "react";

//FunctionalTypescript
export default ({ userId }: { userId: Number }) => {
    const [buttonText, setButtonText] = useState<string>();

    useEffect(() => {
        setButtonText(userId.toString());
    }, []);

    return <div>userId: {buttonText}</div>;
};
