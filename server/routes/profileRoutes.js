const { app } = require("../middlewares/middlewareSetup");
const db = require("../middlewares/db");
const { uploader } = require("../middlewares/upload");
const s3 = require("../middlewares/s3");
const bucketurl = `https://magicplace.s3.amazonaws.com/`;

//api/
//app.get("/user/:id?" would match always /users/:id, even just

app.get("/API/user/:id", function (req, res) {
    console.log("/user/, session: ", req.session);
    console.log("/user/:id Param ", req.params.id);
    if (!req.session || !req.session.userId)
        throw "/user: No UserId in session";

    db.getUserWithoutPasswordAndEmail(req.params.id)
        .then((result) => {
            if (!result.rows.length) console.log("nothing found in db");
            else console.log(req.url + "User found ", result.rows);

            res.json({
                success: true,
                data: result.rows[0],
            });
        })
        .catch((e) => {
            res.json({
                success: false,
                error: "Error getting Profile",
            });

            console.log("/Catch:", e);
        });
});

app.get("/users/", function (req, res) {
    console.log("/user/, session: ", req.session);
    console.log("Query: ", req.query);
    if (!req.session || !req.session.userId)
        throw "/user: No UserId in session";

    db.getUsersLike(req.query.filter)
        .then((result) => {
            if (!result.rows.length)
                console.log("nothing found in db for " + req.query.filter);
            else console.log("users found ", result.rows);

            res.json({
                success: true,
                data: result.rows,
            });
        })
        .catch((e) => {
            res.json({
                success: false,
                error: "Error getting Profile",
            });

            console.log("/user Catch:", e);
        });
});

app.post("/profile/updateBio", (req, res) => {
    if (!req.session || !req.session.userId)
        throw "/user: No UserId in session";

    console.log("req.body: ", req.body);

    db.updateProfileBio(req.session.userId, req.body.bio).then((result) => {
        if (result.rows.length)
            res.json({ success: true, data: result.rows[0] });
        else res.json({ success: false, error: "problem uploading bio" });
        console.log("db bio res: ", result.rows);
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    if (!req.session || !req.session.userId)
        throw "/user: No UserId in session";

    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);
    //if(req.body.username && req.body.title && req.body.description)
    const url = bucketurl + req.file.filename;

    console.log("constructed url ", url);

    db.UpdateProfileImage(req.session.userId, url).then((result) => {
        if (result.rows.length)
            res.json({ success: true, data: result.rows[0] });
        else res.json({ success: false, error: "problem uploading image" });
        console.log("db res: ", result.rows);
    });
});

app.get("/user", function (req, res) {
    console.log("/user/, session: ", req.session);
    if (!req.session || !req.session.userId)
        throw "/user: No UserId in session";
    db.getUserWithoutPasswordAndEmail(req.session.userId)
        .then((result) => {
            if (!result.rows.length) throw "/user user not found in db";
            else console.log("/user found ", result.rows[0]);
            res.json({
                success: true,
                user: result.rows[0],
            });
        })
        .catch((e) => {
            res.json({
                success: false,
                error: "Error getting Profile",
            });

            console.log("/user Catch:", e);
        });
});

app.get("/user/id.json", function (req, res) {
    console.log("/user/id.json, session: ", req.session);
    res.json({
        userId: req.session.userId,
    });
});
