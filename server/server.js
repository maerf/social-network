const express = require("express");
const { app } = require("./middlewares/middlewareSetup");
const path = require("path");

app.use(express.static(path.join(__dirname, "..", "client", "public")));

///////////////// ROUTES
require("./routes/accountManagement");
require("./routes/profileRoutes");
require("./routes/friendshipRoutes");

////LAST ROUTE
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    console.log("star route hit");
});

////SERVER START

const server = require("http").Server(app);

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

module.exports.server = server;

require("./middlewares/sockets");
