let express = require('express');
let db = require('../dbconnection');
let sha256 = require('js-sha256');

const REQUESTS = {
    checkCredentials: (email, password, cb) => {
        return db.query("SELECT username, email, player_level FROM player WHERE email=? AND password=?", [email, password], cb);
    }
};

let router = express.Router();

// /api/login
router.post('/', (req, res, next) => {
    let user = req.body;
    let hash = sha256(user.password);
    REQUESTS.checkCredentials(user.email, hash, (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json(rows); //or return count for 1 & 0
        }
    });
});

module.exports = router;