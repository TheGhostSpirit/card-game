let express = require('express');
let db = require('../dbconnection');

const REQUESTS = {
    saveGame: (email, password, cb) => {
        return db.query("SELECT username, email, player_level FROM player WHERE email=? AND password=?", [email, password], cb);
    }
};

let router = express.Router();

// /api/game
router.post('/', (req, res, next) => {
    let user = req.body;
    REQUESTS.checkCredentials(user.email, hash, (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json(rows); //or return count for 1 & 0
        }
    });
});

module.exports = router;