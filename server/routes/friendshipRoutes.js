const { app } = require("../middlewares/middlewareSetup");
const db = require("../middlewares/db");
const { FriendshipActions } = require("../../FriendshipActions");

app.get("/morefriends", function (req, res) {
    console.log(req.baseUrl + " session: ", req.session);
    if (!req.session || !req.session.userId) {
        console.log("Morefriends: No UserID in session!");
        res.json({
            success: false,
            error: "Error: Are you log  ged in?",
        });
    }

    db.createFriendsGlobal();
});

app.get("/API/directmessages", function (req, res) {
    console.log(req.baseUrl + " session: ", req.session);
    if (!req.session || !req.session.userId) {
        res.json({
            success: false,
            error: "Problem getting Friendships (are you logged in?)",
        });
        console.log("GetFriendsAndWannabies: No UserID in session!");
    }
    const { userId } = req.session;

    db.getDirectMessages(userId)
        .then(({ rows }) => {
            if (!rows.length) console.log("no getDirectMessages found in db");

            res.json({
                success: true,
                data: rows,
            });
        })
        .catch((e) => {
            res.json({
                success: false,
                error: "Error getting DirectMessages :(",
            });

            console.log("getDirectMessages error:", e);
        });
});

app.get("/API/GetFriends/:id", function (req, res) {
    console.log(req.baseUrl + " session: ", req.session);
    if (!req.session || !req.session.userId || !req.params.id) {
        res.json({
            success: false,
            error: "Problem getting Friendships, are you logged in?",
        });
        console.log("GetFriendsAndWannabies: No UserID in session!");
    }
    const { userId } = req.session;

    db.getFriends(req.params.id)
        .then(({ rows }) => {
            if (!rows.length) console.log("no friendship found in db");

            res.json({
                success: true,
                data: rows,
            });
        })
        .catch((e) => {
            res.json({
                success: false,
                error: "Error getting Friendships :(",
            });

            console.log("/Catch:", e);
        });
});

app.get("/API/GetFriendsAndWannabies", function (req, res) {
    console.log(req.baseUrl + " session: ", req.session);
    if (!req.session || !req.session.userId) {
        res.json({
            success: false,
            error: "Problem getting Friendships, are you logged in?",
        });
        console.log("GetFriendsAndWannabies: No UserID in session!");
    }
    const { userId } = req.session;

    db.getFriendsAndWannabies(userId)
        .then(({ rows }) => {
            if (!rows.length) console.log("no friendship found in db");

            res.json({
                success: true,
                data: rows,
            });
        })
        .catch((e) => {
            res.json({
                success: false,
                error: "Error getting Friendships :(",
            });

            console.log("/Catch:", e);
        });
});

app.post("/API/DoFriendshipAction/", (req, res) => {
    if (!req.session || !req.session.userId) throw "No UserId in session";
    if (!req.body.otherUserId) throw "No otherUserId in Body";
    if (!req.body.action) throw "No action in Body";
    let error = "";
    const { otherUserId } = req.body;
    const { userId } = req.session;

    if (req.body.action == FriendshipActions.MakeFriendrequest) {
        db.createFriendRequest(userId, otherUserId)
            .then((result) => {
                if (result.rows.length) {
                    console.log("successful fs insert");

                    res.json({
                        success: true,
                        bla: "yes",
                        action: FriendshipActions.CancelFriendRequest,
                    });
                } else {
                    console.log("unsuccessful insert");
                    res.json({
                        success: false,
                        error: "error adding friendrequest",
                    });
                }
            })

            .catch((e) => {
                res.json({
                    success: false,
                    error: "Error getting Profile",
                });

                console.log("/Catch:", e);
            });
        console.log("body:", req.body);
    } else if (req.body.action == FriendshipActions.CancelFriendRequest) {
        console.log("body:", req.body);
        db.getFriendship(req.session.userId, otherUserId)
            .then((result) => {
                if (result.rows.length) {
                    console.log(
                        "CancelFriendRequest -> Friendship entry found, proceeding"
                    );
                } else {
                    res.json({
                        success: false,
                        error: "Error cancelling friendship",
                    });
                }
            })
            .then(() => {
                db.deleteFriendship(req.session.userId, otherUserId).then(
                    (deleteResult) => {
                        if (deleteResult.rows) {
                            res.json({
                                success: true,
                                action: FriendshipActions.MakeFriendrequest,
                            });
                        } else {
                            res.json({
                                success: false,
                                error: "Error cancelling friendship (Error 2)",
                            });
                        }
                    }
                );
            });
    } else if (req.body.action == FriendshipActions.AcceptFriendRequest) {
        console.log("body:", req.body);
        db.getFriendship(req.session.userId, otherUserId)
            .then((result) => {
                if (result.rows.length) {
                    console.log(
                        "AcceptFriendship -> Friendship entry found, proceeding"
                    );
                } else {
                    res.json({
                        success: false,
                        error: "Error accepting Friendship",
                    });
                }
            })
            .then(() => {
                db.acceptFriendship(req.session.userId, otherUserId).then(
                    (result) => {
                        if (result.rows) {
                            res.json({
                                success: true,
                                action: FriendshipActions.Unfriend,
                            });
                        } else throw "No rows return from accept friendship";
                    }
                );
            })
            .catch((e) => {
                res.json({
                    success: false,
                    error: "Error accepting friendship (Error)",
                });

                console.log("/Catch:", e);
            });
    } else if (req.body.action == FriendshipActions.Unfriend) {
        console.log("body:", req.body);
        db.getFriendship(req.session.userId, otherUserId)
            .then((result) => {
                if (result.rows.length) {
                    console.log(
                        "AcceptFriendship -> Friendship entry found, proceeding"
                    );
                } else {
                    res.json({
                        success: false,
                        error: "Error accepting Friendship",
                    });
                }
            })
            .then(() => {
                db.deleteFriendship(req.session.userId, otherUserId).then(
                    (deleteResult) => {
                        if (deleteResult.rows) {
                            res.json({
                                success: true,
                                action: FriendshipActions.MakeFriendrequest,
                            });
                        } else throw "Delete Friendship returned no rows";
                    }
                );
            })
            .catch((e) => {
                res.json({
                    success: false,
                    error: "Error deleting friendship",
                });

                console.log("/Catch:", e);
            });
    } else {
        res.json({
            success: false,
            error: "not implemented yet: " + req.body.action,
        });
    }
});

app.get("/API/GetFriendshipActionFor/:id", function (req, res) {
    console.log("/user/, session: ", req.session);
    console.log("/user/:id Param ", req.params.id);
    if (!req.session || !req.session.userId)
        throw "/user: No UserId in session";
    const { userId } = req.session;

    db.getFriendship(userId, req.params.id)
        .then(({ rows }) => {
            if (!rows.length) {
                console.log("no friendship found in db");
                res.json({
                    success: true,
                    action: FriendshipActions.MakeFriendrequest,
                });
            } else {
                const friendship = rows[0];
                console.log("friendship found ", rows);
                if (friendship.accepted) {
                    res.json({
                        success: true,
                        action: FriendshipActions.Unfriend,
                    });
                } else if (
                    !friendship.accepted &&
                    friendship.sender_id == userId
                ) {
                    res.json({
                        success: true,
                        action: FriendshipActions.CancelFriendRequest,
                    });
                } else if (
                    !friendship.accepted &&
                    friendship.recipient_id == userId
                ) {
                    res.json({
                        success: true,
                        action: FriendshipActions.AcceptFriendRequest,
                    });
                }
            }
        })
        .catch((e) => {
            res.json({
                success: false,
                error: "Error getting Friendship data :(",
            });

            console.log("/Catch:", e);
        });
});
