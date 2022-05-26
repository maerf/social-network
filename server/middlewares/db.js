const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:spiced:spiced@localhost:5432/socialnet`
);

//Todo: LastLogin field column, wenn null -> ausgeloggt. jeweils mit serverzeit vergleichen.

const doInit = false;

//todo:  sollten user_id's referenzieren -> keine stray friendships ohne refs
// if (doInit)
//     db.query(
//         `drop table if exists friendships cascade;
//         CREATE TABLE friendships (
//     id              SERIAL PRIMARY KEY,
//     sender_id       VARCHAR(255) NOT NULL CHECK (sender_id != '') CHECK (sender_id != recipient_id),
//     recipient_id    VARCHAR(255) NOT NULL CHECK (recipient_id != '') CHECK (sender_id != recipient_id),
//     accepted        BOOLEAN  NOT NULL,
//     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );`
//     );

// if (doInit)
//     db.query(
//         `drop table if exists passwordcodes cascade;
//         CREATE TABLE passwordcodes (
//     id              SERIAL PRIMARY KEY,
//     email           VARCHAR(255) NOT NULL,
//     code             VARCHAR(255) NOT NULL,
//     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );`
//     );

// if (doInit)
//     db.query(
//         `drop table if exists users cascade;
//         CREATE TABLE users (
//     id              SERIAL PRIMARY KEY,
//     first           VARCHAR(255) NOT NULL CHECK (first != ''),
//     last            VARCHAR(255) NOT NULL CHECK (last != ''),
//     email           VARCHAR(255) NOT NULL UNIQUE,
//     password        VARCHAR(255) NOT NULL,
//     image_url       Text,
//     bio             Text,
//     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     real boolean,
//     bubble text,
// );`
//     );

// if (doInit)
//     db.query(
//         `drop table if exists signatures cascade;
//         CREATE TABLE signatures (
//         id          SERIAL PRIMARY KEY,
//         user_id     INTEGER NOT NULL UNIQUE REFERENCES users(id),
//         signature   TEXT NOT NULL CHECK (signature != '')
// );`
//     );

// if (doInit)
//     db.query(
//         `DROP TABLE IF EXISTS user_profiles CASCADE;
//         CREATE TABLE user_profiles(
//         id SERIAL PRIMARY KEY,
//         age INT,
//         city VARCHAR(255),
//         url VARCHAR(255),
//         user_id INT UNIQUE NOT NULL REFERENCES users(id)
// );`
//     );

//  recipient_id    VARCHAR(255), //NOT NULL CHECK (recipient_id != '') CHECK (sender_id != recipient_id),
// if (doInit)
//     db.query(
//         `drop table if exists chatmessages cascade;
//         CREATE TABLE chatmessages(
//     id              SERIAL PRIMARY KEY,
//     sender_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//     recipient_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     message        Text NOT NULL,
//     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// read BOOLEAN  NOT NULL,
// notified BOOLEAN  NOT NULL,
// );`
//     );

exports.createFriendsGlobal = () => {
    db.query(`select * from users`).then(({ rows: userRows }) => {
        const userCount = userRows.length;
        console.log("numUsers", userCount);

        db.query(`select * from friendships`).then(({ rows: friendRows }) => {
            const numFriendsGlobal = friendRows.length;

            console.log("numFriendsGlobal", numFriendsGlobal);
            console.log("math", Math.random());
            // console.log("userrows", userRows);

            userRows.forEach((userRow, index) => {
                let selectedFriend;
                do {
                    selectedFriend = Math.floor(Math.random() * userCount + 1);
                    //selectedFriend -= 1;
                } while (userRow == userRows[selectedFriend - 1]); //while (false); //

                const accept = Math.random() < 0.6;

                // console.log(
                //     `selected friend for user#${
                //         userRow.id
                //     } is ${selectedFriend}(id:${
                //         userRows[selectedFriend - 1].id
                //     }),  would he accept? ${accept}`
                // );

                db.query(
                    `insert into friendships(sender_id, recipient_id, accepted) values ($1, $2, $3) returning *`,
                    [userRow.id, userRows[selectedFriend - 1].id, accept]
                ).then(({ rows }) => {
                    if (rows.length)
                        console.log(
                            `selected friend for user#${
                                userRow.id
                            } is ${selectedFriend}(id:${
                                userRows[selectedFriend - 1].id
                            }),  would he accept? ${accept}`
                        );
                });
            });
        });
    });
};

exports.getDirectMessages = (userId) => {
    return db.query(
        `SELECT sender_id ,recipient_id, u1.image_url, chatmessages.created_at, message, chatmessages.id AS "id", 
        u1.image_url AS "sender_img",
        u2.image_url AS "recipient_img",
        concat(u1.first,' ',u1.last) AS "sender_name",
        concat(u2.first,' ',u2.last) AS "recipient_name"
FROM chatmessages
JOIN users AS u1
ON chatmessages.sender_id = u1.id
JOIN users AS u2
ON chatmessages.recipient_id = u2.id
where(chatmessages.sender_id = $1 AND chatmessages.recipient_id is not null) or (chatmessages.recipient_id = $1 )
order by chatmessages.id ASC`,
        [userId]
    );
};

// chatmessages.id, message, first, last, image_url, chatmessages.created_at, (users.id) as "user_id"
//         from chatmessages join users on users.id=chatmessages.sender_id where (chatmessages.id < $1 and chatmessages.recipient_id is null)) select  from direct_messages

// exports.getDirectMessages = (userId) => {
//     return db.query(
//         `select chatmessages.id, message, first, last, image_url, chatmessages.created_at, chatmessages.sender_id, chatmessages.recipient_id, (users.id) as "user_id",
//         from chatmessages join users on users.id=chatmessages.sender_id where(chatmessages.sender_id = $1 AND chatmessages.recipient_id is not null) or (chatmessages.recipient_id = $1 )order by chatmessages.id`,
//         [userId]
//     );
// };

// old variant exports.getDirectMessages = (userId) => {
//     return db.query(
//         `with direct_messages as (select chatmessages.id, message, first, last, image_url, chatmessages.created_at, (users.id) as "user_id"
//         from chatmessages join users on users.id=chatmessages.sender_id where (chatmessages.id < $1 and chatmessages.recipient_id is null)) select * from direct_messages`,
//         [userId]
//     );
// };

exports.getLastRoomMessages = (idLowerThan = 99999) => {
    return db.query(
        `select chatmessages.id, message, first, last, image_url, chatmessages.created_at, (users.id) as "user_id" 
        from chatmessages join users on users.id=chatmessages.sender_id where (chatmessages.id < $1 and chatmessages.recipient_id is null) order by chatmessages.id desc limit 5`,
        [idLowerThan]
    );
};

exports.insertChatMessage = (senderId, text, recipient_id) => {
    return db.query(
        `with inserted_message as (insert into chatmessages(sender_id, message, recipient_id) values ($1, $2, $3) returning *) 
        select inserted_message.id,message, first, last, image_url, inserted_message.created_at, (users.id) as "user_id", 
        sender_id, recipient_id from inserted_message join users on users.id=inserted_message.sender_id `,
        [senderId, text, recipient_id || null]
    );
};

exports.getFriends = (userId) => {
    console.log("called getFriends with id:", userId);
    return db.query(
        `SELECT users.id, users.first, users.last, users.image_url, friendships.accepted
        FROM friendships
        JOIN users
        ON (accepted = true AND recipient_id = $1 AND sender_id = users.id::varchar)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id::varchar)`,
        [userId]
    );
};

exports.getFriendsAndWannabies = (idMe) => {
    console.log("called getFriendsAndWannabies with id:", idMe);
    return db.query(
        `SELECT users.id, users.first, users.last, users.image_url, friendships.accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id::varchar)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id::varchar)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id::varchar)`,
        [idMe]
    );
};

exports.acceptFriendship = (idMe, idOther) => {
    console.log("db updating ", idMe, " ", idOther);
    return db.query(
        `update friendships set accepted=true where(recipient_id=$1 and sender_id=$2)  returning *`,
        [idMe, idOther]
    );
};

exports.deleteFriendship = (idMe, idOther) => {
    console.log("db inserting ", idMe, " ", idOther);
    return db.query(
        `delete from friendships where(recipient_id=$1 and sender_id=$2) or (recipient_id=$2 and sender_id=$1) returning *`,
        [idMe, idOther]
    );
};

exports.createFriendRequest = (idMe, idOther) => {
    console.log("db inserting ", idMe, " ", idOther);
    return db.query(
        `insert into friendships(sender_id, recipient_id, accepted) values ($1, $2, false) returning *`,
        [idMe, idOther]
    );
};

exports.getFriendship = (id1, id2) => {
    console.log("db searching", id1, " ", id2);
    return db.query(
        `select * from friendships where(recipient_id=$1 and sender_id=$2) or (recipient_id=$2 and sender_id=$1)`,
        [id1, id2]
    );
};

exports.getUsersLike = (str = "") => {
    console.log("user search string: ", str);
    return db.query(
        `select id,first,last,image_url,bio,created_at from users where first ilike $1 order by created_at desc limit 3`,
        [str + "%"]
    );
};

exports.updateProfileBio = (userId, bio) => {
    //if (user_id && sig)
    return db.query(`update users set bio=$2 where id=$1 returning bio`, [
        userId,
        bio,
    ]);
};

exports.UpdateProfileImage = (userId, imageUrl) => {
    //if (user_id && sig)
    return db.query(
        `update users set image_url=$2 where id=$1 returning image_url`,
        [userId, imageUrl]
    );
};

exports.getUserWithoutPasswordAndEmail = (id) => {
    return db.query(
        `select id,first,last,image_url,bio,created_at from users where id = $1`,
        [id]
    );
};

exports.getMatchingPasswordResetKeys = ({ email, code }) => {
    return db.query(
        `select * from passwordcodes WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' and email=$1 and code=$2;`,
        [email, code]
    );
};

exports.changePassword = ({ email, password }) => {
    return db.query(
        `update users set password=$2
where email=$1 returning id`,
        [email, password]
    );
};

exports.insertResetCode = (email, code) => {
    return db.query(
        `insert into passwordcodes (email, code) values($1,$2) returning id`,
        [email || null, code || null]
    );
};

exports.upsertUserProfile = ({ userId, city, age, url }) => {
    return db.query(
        `insert into user_profiles (user_id, city, age, url)
    values($1, $2, $3,$4)
    on conflict(user_id)
    do update set city = $2, age = $3, url = $4 returning id`,
        [userId, city, age || null, url]
    );
};

exports.updateUserWithoutPassword = ({ userId, first, last, email }) => {
    return db.query(
        `update users set first=$2, last=$3, email=$4 where id = $1`,
        [userId, first, last, email]
    );
};

exports.upsertUserWithPassword = ({ userId, password, first, last, email }) => {
    return db.query(
        `insert into users (id, password, first, last, email )
    values($1, $2, $3, $4, $5)
    on conflict(id)
    do update set password=$2, first = $3, last = $4, email = $5 returning id`,
        [userId, password || null, first, last, email]
    );
};

/* Only PW?
exports.updateUserWithPassword = (userId, passwordHash, first, last, email) => {
    return db.query(`update users set password = $1 where id = $2`, [
        passwordHash,
        userId,
    ]);
};*/
/* geht n 
exports.updateUserWithoutPassword = ({ userId, first, last, email }) => {
    return db.query(
        `update users (first, last, email) values($2, $3, $4) where id = $1`,
        [userId, first, last, email]
    );
};
*/

/* lame way (untested)
exports.updatePassword = (userId, passwordHash) => {
    return db.query(
        `insert into users (password, id) 
        values($1, $2)
        on conflict (id)
        set password = $1, id= $2`,
        [passwordHash, userId]
    );
}; */

if (doInit) console.log(db.query(`select * from signatures`));

exports.registerUser = (first, last, email, password) => {
    return db.query(
        `insert into users (first, last, email, password) values($1,$2,$3,$4) returning id`,
        [first, last, email, password || null]
    );
};

exports.getUser = (email) => {
    return db.query(`select * from users where email = $1`, [email]); //Todo: what if multiple found?
};

exports.createProfile = ({ city, age, homepage, userId }) => {
    console.log("profile userid", userId);
    console.log("create profile:", city, age, homepage, userId);
    if (userId)
        return db.query(
            `INSERT INTO user_profiles (age,
        city,
        url,
        user_id)
        VALUES ($1, $2,$3, $4) returning id`,
            [age || null, city, homepage, userId]
        );
    else
        return Promise.reject(
            "Something went wrong creating your profile, please make sure you're logged in."
        );
};
