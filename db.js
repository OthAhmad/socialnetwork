const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

exports.registerUser = (firstname, lastname, email, password) => {
    return db.query(
        `INSERT INTO users(firstname, lastname, email, password)
        VALUES($1, $2, $3, $4) RETURNING id`,
        [firstname, lastname, email, password]
    );
};

exports.userLogin = email => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

exports.insertCode = (email, code) => {
    return db
        .query(
            `INSERT INTO code (email, code)
            VALUES ($1, $2)
            ON CONFLICT (email)
            DO
                UPDATE
                SET code=$2`,
            [email, code]
        )
        .then(({ rows }) => rows);
};
exports.getCode = email => {
    return db
        .query(
            `SELECT * FROM code
            WHERE email=$1 ;`,
            [email]
        )
        .then(({ rows }) => rows);
};
exports.updatePass = (email, newPass) => {
    return db
        .query(
            `UPDATE users
        SET password=$2
        WHERE email=$1
        RETURNING id`,
            [email, newPass]
        )
        .then(({ rows }) => rows);
};

exports.getUser = id => {
    return db
        .query(
            `SELECT * FROM users
            WHERE id=$1`,
            [id]
        )
        .then(({ rows }) => rows);
};

exports.updatePic = (id, imageUrl) => {
    return db
        .query(
            `UPDATE users
            SET imageUrl=$2
            WHERE id=$1
            RETURNING imageUrl`,
            [id, imageUrl]
        )
        .then(({ rows }) => rows);
};

exports.updateBio = (id, bio) => {
    return db
        .query(
            `UPDATE users
        SET bio=$2
        WHERE id=$1
        RETURNING bio`,
            [id, bio]
        )
        .then(({ rows }) => rows);
};

exports.getUsers = () => {
    return db
        .query(
            `SELECT * FROM users
        ORDER BY id DESC
        LIMIT 3`
        )
        .then(({ rows }) => rows);
};

exports.getMatchingUsers = val => {
    return db
        .query(
            `SELECT * FROM users
        WHERE firstname ILIKE $1
        LIMIT 4`,
            [val + "%"]
        )
        .then(({ rows }) => rows);
};

exports.friendRelations = (sender, recipient) => {
    return db
        .query(
            `SELECT * FROM friends
            WHERE (recipient_id = $1 AND sender_id = $2)
            OR (recipient_id = $2 AND sender_id = $1);`,
            [recipient, sender]
        )
        .then(({ rows }) => rows);
};

exports.makeFriendReq = (sender, recipient) => {
    return db
        .query(
            `INSERT INTO friends (sender_id, recipient_id)
            VALUES ($1, $2)
            RETURNING id`,
            [sender, recipient]
        )
        .then(({ rows }) => rows);
};

exports.acceptFriendReq = (recipient, sender) => {
    return db
        .query(
            `UPDATE friends
            SET accepted=true
            WHERE sender_id=$2 AND recipient_id=$1
            RETURNING id`,
            [recipient, sender]
        )
        .then(({ rows }) => rows);
};

exports.endFriendship = (recipient, sender) => {
    return db
        .query(
            `DELETE FROM friends
            WHERE (recipient_id = $1 AND sender_id = $2)
            OR (recipient_id = $2 AND sender_id = $1);`,
            [recipient, sender]
        )
        .then(({ rows }) => rows);
};

exports.handleConnections = id => {
    return db
        .query(
            `SELECT users.id, firstname, lastname, imageUrl, accepted
            FROM friends
            JOIN users
            ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
            OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
            OR (accepted = true AND sender_id = $1 AND recipient_id = users.id);`,
            [id]
        )
        .then(({ rows }) => rows);
};

exports.getLastMessages = () => {
    return db
        .query(
            `SELECT chats.id as id, user_id, firstname, lastname, imageUrl, message FROM chats
            JOIN users
            ON chats.user_id=users.id
            ORDER BY chats.id DESC
            LIMIT 10`
        )
        .then(({ rows }) => rows);
};

exports.insertMessage = (msg, id) => {
    return db
        .query(
            `INSERT INTO chats (user_id, message)
            VALUES ($1, $2)
            RETURNING id`,
            [id, msg]
        )
        .then(({ rows }) => rows);
};

exports.getSenderMessage = id => {
    return db
        .query(
            `SELECT chats.id as id, user_id, firstname, lastname, imageUrl, message FROM chats
            JOIN users
            ON chats.user_id=users.id
            WHERE chats.id=$1`,
            [id]
        )
        .then(({ rows }) => rows);
};
