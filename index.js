const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const {
    registerUser,
    userLogin,
    insertCode,
    getCode,
    updatePass,
    getUser,
    updatePic,
    updateBio,
    getUsers,
    getMatchingUsers,
    endFriendship,
    friendRelations,
    acceptFriendReq,
    makeFriendReq,
    handleConnections,
    insertMessage,
    getLastMessages,
    getSenderMessage
} = require("./db");
const csurf = require("csurf");
const { sendEmail } = require("./ses");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

let sessionSecret;

if (process.env.NODE_ENV === "production") {
    sessionSecret = process.env;
} else {
    sessionSecret = require("./secrets");
}

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(express.static(__dirname + "/public"));

app.use(express.json());

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.post("/register", (req, res) => {
    bcrypt
        .hash(req.body.password)
        .then(hash => {
            return registerUser(
                req.body.firstname,
                req.body.lastname,
                req.body.email,
                hash
            );
        })
        .then(data => {
            req.session = {
                userId: data.rows[0].id
            };
            res.json({ success: true });
        })
        .catch(err => console.log("ERROR IN REGISTER REQ", err));
});

app.post("/login", (req, res) => {
    userLogin(req.body.email)
        .then(data => {
            console.log("data in log in", data);
            req.session = {
                userId: data.rows[0].id
            };
            return bcrypt.compare(req.body.password, data.rows[0].password);
        })
        .then(bool => {
            if (bool == true) {
                res.json({ success: true });
            } else {
                req.session = null;
                throw Error;
            }
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/logout", (req, res) => {
    req.session.userId = null;
    delete req.session;
    res.redirect("/welcome#/login");
});

app.post("/reset/start", (req, res) => {
    if (req.session) {
        req.session.userId = null;
        delete req.session;
    }
    console.log(req.body);
    userLogin(req.body.email)
        .then(data => {
            const cryptoRandomString = require("crypto-random-string");
            const secretCode = cryptoRandomString({
                length: 6
            });
            const message = `The code ${secretCode} has been generated for you. Please insert it and reset your password`;
            const recipient = `othman0ahmad@gmail.com`;
            sendEmail(recipient, message, "Password Reset");
            insertCode(req.body.email, secretCode)
                .then(data => {
                    if (data) {
                        res.json({
                            success: true
                        });
                    } else {
                        res.json({
                            success: false
                        });
                    }
                })
                .catch(err => console.log("err in insertCode: ", err));
        })
        .catch(err => console.log("error in userLogin: ", err));
});

app.post("/reset/verify", (req, res) => {
    if (req.session) {
        req.session.userId = null;
        delete req.session;
    }
    getCode(req.body.email).then(data => {
        console.log(data);
        if (data[0].code == req.body.code) {
            bcrypt.hash(req.body.password).then(hash => {
                updatePass(req.body.email, hash)
                    .then(() => {
                        res.json({
                            success: true
                        });
                    })
                    .catch(err => console.log("err in updatePassword : ", err));
            });
        } else {
            res.json({
                success: false
            });
        }
    });
});

app.get("/user", (req, res) => {
    getUser(req.session.userId)
        .then(data => {
            res.json(data[0]);
        })
        .catch(err => console.log("error in getUser: ", err));
});

app.get("/api/user/:id", (req, res) => {
    getUser(req.params.id)
        .then(data => {
            res.json({
                data: data[0],
                loggedUser: req.session.userId
            });
        })
        .catch(err => console.log("err in getUser: ", err));
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const imageUrl = s3Url + req.file.filename;
    if (req.file) {
        updatePic(req.session.userId, imageUrl)
            .then(data => {
                console.log(data);
                res.json(data);
            })
            .catch(err => console.log("error in updatePic: ", err));
    }
});

app.post("/edit-bio", (req, res) => {
    const { id, bio } = req.body;
    updateBio(id, bio)
        .then(data => {
            res.json(data[0]);
        })
        .catch(err => console.log("err in updateBio : ", err));
});

app.get("/api/getUsers", (req, res) => {
    getUsers()
        .then(data => {
            res.json(data);
        })
        .catch(err => console.log("error : ", err));
});

app.get("/api/getMatchingUsers/:id", (req, res) => {
    getMatchingUsers(req.params.id)
        .then(data => {
            res.json(data);
        })
        .catch(err => console.log("error : ", err));
});

app.get("/friends-status/:id", (req, res) => {
    friendRelations(req.session.userId, req.params.id)
        .then(data => {
            res.json(data[0]);
        })
        .catch(err => console.log("error ", err));
});
app.post("/make-friend-req/:id", (req, res) => {
    makeFriendReq(req.session.userId, req.params.id).then(data => {
        res.json({
            success: true,
            data
        });
    });
});

app.post("/accept-friend-req/:id", (req, res) => {
    acceptFriendReq(req.session.userId, req.params.id).then(data => {
        res.json({
            success: true,
            data
        });
    });
});

app.post("/end-friendship/:id", (req, res) => {
    endFriendship(req.session.userId, req.params.id).then(() => {
        res.json({
            success: true
        });
    });
});

app.get("/friends-invitations", (req, res) => {
    handleConnections(req.session.userId).then(data => {
        console.log(data);
        res.json(data);
    });
});

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

io.on("connection", socket => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    let userId = socket.request.session.userId;

    socket.on("chatMessage", msg => {
        insertMessage(msg, userId)
            .then(res => {
                getSenderMessage(res[0].id).then(data => {
                    io.sockets.emit("chatMessage", data);
                });
            })
            .catch(e => console.log("error in insertMessage: ", e));
    });

    getLastMessages()
        .then(data => {
            io.sockets.emit("chatMessages", data.reverse());
        })
        .catch(err => console.log("error: ", err));
});

server.listen(8080, function() {
    console.log("I'm listening.");
});
