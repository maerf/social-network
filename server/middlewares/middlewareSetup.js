const express = require("express");
const app = express();

const compression = require("compression");
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.set("x-frame-options", "deny");
    next();
});

app.use((req, res, next) => {
    console.log(req.method, "req.url: ", req.url);
    next();
});

let mySessionSecret = process.env.SESSION_SECRET;
if (!mySessionSecret)
    mySessionSecret = require("../secrets.json")["cookie-session-secret"];

const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: mySessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});

app.use(cookieSessionMiddleware);

exports.app = app;
