let express = require('express');
let db = require('../dbconnection');

const REQUESTS = {
    saveGame: (email, savedGame, score, cb) => {
        return db.query("UPDATE game SET game_id=?, game_score = ? WHERE email=? AND game_status=1", [savedGame, score, email], cb);
    },
    newGame: (email, cb) => {
        return db.query("CALL newGame(?)", email, cb);
    },
    restoreGame: (email, cb) => {
        return db.query("SELECT game_id, game_score FROM game WHERE email=? AND game_status=1", email, cb);
    },
    endGame: (email, score, cb) => {
        return db.query("CALL endGame(?,?)", [email, score], cb);
    },
    initChallenge: (email, cb) => {
        return db.query("CALL newChallenge(?)", email, cb);
    },
    endChallenge: (email, score, cb) => {
        return db.query("CALL endChallenge(?,?)", [email, score], cb);
    },
    getChallenge: (cb) => {
        return db.query("SELECT game FROM challenge HAVING MAX(id_challenge)", cb);
    }
};

let router = express.Router();

router.put('/save', (req, res, next) => {
    let save = req.body;
    REQUESTS.saveGame(save.email, JSON.stringify(save.savedGame), save.score, (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json({ status: true });
        }
    });
});

router.post('/new', (req, res, next) => {
    REQUESTS.newGame(req.body.email, (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json({ status: true });
        }
    });
});

router.get('/restore/:email', (req, res, next) => {
    REQUESTS.restoreGame(req.params.email, (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            if (rows.length > 0) {
                res.json({
                    score: rows[0].game_score,
                    game: JSON.parse(rows[0].game_id),
                    status: rows[0].game_id !== '{}'
                });
            }
            else {
                res.json({
                    status: false
                });
            }
        }
    });
});

router.put('/end', (req, res, next) => {
    REQUESTS.endGame(req.body.email, req.body.score, (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json({ status: true });
        }
    });
});

router.post('/newChallenge', (req, res, next) => {
    REQUESTS.initChallenge(req.body.email, (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json({ status: true });
        }
    });
});

router.put('/endChallenge', (req, res, next) => {
    REQUESTS.endChallenge(req.body.email, req.body.score, (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json({ status: true });
        }
    });
});

router.get('/getChallenge', (req, res, next) => {
    REQUESTS.getChallenge((err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                score: 3000,
                game: JSON.parse(rows[0].game)
            })
        }
    });
});

module.exports = router;