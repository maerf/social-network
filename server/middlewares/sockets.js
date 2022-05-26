const db = require("../middlewares/db.js");
const { server } = require("../server");

const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
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

let onliners = Object;

io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", (socket) => {
    const userId = socket.request.session.userId;

    onliners[userId]
        ? onliners[userId].push(socket.id)
        : (onliners[userId] = [socket.id]);

    console.log(
        `New connection established with socket.id: ${socket.id}, which is UserID ${userId}`
    );

    socket.on("disconnect", () => {
        if (onliners[userId] && onliners[userId].length > 1) {
            onliners[userId] = onliners[userId].filter(
                (soc) => soc !== socket.id
            );
            console.log(
                `User ${userId} (${socket.id}) just disconnected a socket`
            );
        } else {
            delete onliners[userId];
            console.log(
                `User  ${userId} (${socket.id}) just disconnected completely 😱 `
            );
        }

        console.log("onlineUsers after disconnect: ", onliners);
    });

    db.getLastRoomMessages()
        .then((result) => {
            socket.emit("LastMessages", result.rows);
        })
        .catch((e) => {
            socket.emit("LastMessages", []);
        });

    socket.on("message", async (text) => {
        if (text)
            db.insertChatMessage(userId, text)
                .then((result) => {
                    socket.emit("NewRoomMessage", result.rows[0]);
                })
                .catch((e) => {
                    socket.emit("NewRoomMessage", []);
                    console.log("NewRoomMessage Error: ", e);
                });
    });

    socket.on("directMessage", async (obj) => {
        console.log(
            `new directMessage from ${obj.from}, to ${obj.to}, message:"${obj.message}"`
        );

        if (obj.message)
            db.insertChatMessage(userId, obj.message, obj.to)
                .then(({ rows }) => {
                    console.log("direct message", rows[0]);
                    onliners[obj.to]?.forEach((userSocket) =>
                        io.to(userSocket).emit("newDirectMessage", rows[0])
                    );
                    if (obj.to !== userId)
                        socket.emit("DirectMessageMyCopy", rows[0]);
                })
                .catch((e) => {
                    console.log("newDirectMessage error: ", e);
                });
    });

    socket.on("chat/getMore", async (id) => {
        db.getLastRoomMessages(id)
            .then((result) => {
                socket.emit("LastMessages", result.rows);
            })
            .catch((e) => {
                socket.emit("LastMessages", []);
                console.log("Error getting more chat messages: ", e);
            });
    });
});
