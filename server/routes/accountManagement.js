const { app } = require("../middlewares/middlewareSetup");

const { sendEmail } = require("../middlewares/ses");
const cryptoRandomString = require("crypto-random-string");
const { hash, compare } = require("../middlewares/bcrypt");

const db = require("../middlewares/db.js");

app.get("/demo/:id", (req, res) => {
    const id = req.params.id;
    console.log("Demo login id:", id);
    if (!Number(id) || !Number.isInteger(Number(id)))
        return res.send(
            "Oh oh, invalid account id for demo login, please enter positive integer below 199, I suggest 1 to 4, because the other account are pretty dead-ish"
        );
    else {
        // res.clearCookie("session");
        req.session.userId = id;
        res.status(302);
        res.location("/");
        res.end();
    }
});

app.get("/clear", (req, res) => {
    res.clearCookie("session");
    res.status(302);
    res.location("/");
    res.end();
    return;
});

app.post("/pwrReceiveCode.json", (req, res) => {
    console.log("reg body: ", req.body);
    const email = req.body.email;
    const code = req.body.code;
    const rawPassword = req.body.newPassword;

    if (!email)
        res.json({
            success: false,
            error: "email is falsy, oh no I knew that this could happen",
        });
    if (!code)
        res.json({
            success: false,
            error: "code is falsy",
        });
    if (!rawPassword)
        if (!code)
            res.json({
                success: false,
                error: "newPassword is falsy",
            });

    db.getMatchingPasswordResetKeys({ email, code })
        .then((result) => {
            console.log("Just FYI: MatchingPasswordResetKeys  ", result.rows);
            if (result.rows.length == 0) {
                return Promise.reject("no valid match for password reset code");
            } else console.log("yay we have a match", result.rows[0]);
        })
        .then(() => hash(rawPassword))
        .then((password) => {
            return db.changePassword({ password, email });
        })
        .then((result) => {
            if (result.rows.length) console.log("pw changed, yay");
            return res.json({ success: true });
        })
        .catch((err) => {
            console.log("CATCH reset Password: ", err);

            res.json({
                success: false,
                error: "Reset failed. Rest assured, one of our employee will die for this. Please try again.",
            });
        });
});

app.post("/pwrCheckEmail.json", (req, res) => {
    const email = req.body.email;
    console.log("reg body: ", req.body);
    db.getUser(email)
        .then((result) => {
            console.log("FYI - user from db: ", result.rows[0]);
            if (result.rows.length == 0) {
                return Promise.reject("email address not found in db");
            }
        })
        .then(() => {
            const secretCode = cryptoRandomString({ length: 6 });
            console.log("Psst, the code is: ", secretCode);
            return db.insertResetCode(email, secretCode).then((result) => {
                console.log("ResetCodeId: ", result.rows[0]);
                if (result.rows.length == 0)
                    return Promise.reject("Problem inserting reset code in DB");
                else console.log("resetkey insert successful");

                return sendEmail(
                    "thenewestmodel@gmail.com",
                    "You requested to reset your password",
                    "Remember your password this time, or we will get angry. Here is your code:" +
                        secretCode
                ).then((emailResult) => {
                    console.log("Emailresult?", emailResult);
                    return res.json({ success: true });
                });
            });
        })
        .catch((err) => {
            console.log("CATCH reset Password: ", err);

            res.json({
                success: true,
                error: "not really success but lets pretend. Actually: " + err,
            });
        });
});

app.post("/login.json", (req, res) => {
    const { email, password } = req.body;

    db.getUser(email)
        .then((result) => {
            console.log("userid: ", result.rows[0]);
            if (result.rows.length == 0) {
                return Promise.reject("Please check Username and Password");
            }
            return compare(password, result.rows[0].password)
                .then((isPassword) => {
                    console.log("is password", isPassword);
                    if (isPassword) {
                        req.session.userId = result.rows[0].id;

                        res.json({ success: true });
                        return;
                    } else
                        return Promise.reject(
                            "Please check Username and PASSWORD"
                        );
                })
                .catch((err) => {
                    console.log("login error inner catch: ", err);

                    res.json({
                        success: false,
                        error: "please check username and password",
                    });
                });
        })
        .catch((err) => {
            console.log("login error outer catch: ", err);

            res.json({
                success: false,
                error: "please check username and password",
            });
        });
});

app.post("/register.json", (req, res) => {
    const { first, last, email, password } = req.body;
    console.log("reg body: ", req.body);

    if (!password) {
        res.json({
            success: false,
            error: "Password can't be empty",
        });
    }
    hash(password)
        .then((hashed) => {
            console.log(hashed);

            return db
                .registerUser(first, last, email, hashed)
                .then((result) => {
                    console.log("userid: ", result.rows[0].id);
                    req.session.userId = result.rows[0].id;

                    res.json({ success: true });
                    return;
                })
                .catch((err) => {
                    console.log(
                        "registration error: ",
                        err.message,
                        err.detail
                    );
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("registration error: ", err.message, err.detail);
            res.json({ success: false });
        });
});
