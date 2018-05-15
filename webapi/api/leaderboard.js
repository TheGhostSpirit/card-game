let express = require('express');
let db = require('../dbconnection');

const REQUESTS = {
    getRankings: (cb) => {
        return db.query("SELECT username,points,games_played,games_won FROM player ORDER BY points DESC LIMIT 25", cb);
    },
    getChallengers: (cb) => {
        return db.query("SELECT p.username,p.points,d.challenge_score FROM player p INNER JOIN do_challenge d ON p.email = d.email WHERE d.challenge_status = 2 AND id_challenge IN (SELECT id_challenge from do_challenge HAVING MAX(id_challenge)) ORDER BY d.challenge_score DESC LIMIT 25", cb);
    }
};

let router = express.Router();

// save game
// PUT /api/games/
router.get('/global', (req, res, next) => {
    REQUESTS.getRankings((err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json(rows); //or return count for 1 & 0
        }
    });
});

router.get('/challenge', (req, res, next) => {
    REQUESTS.getChallengers((err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json(rows); //or return count for 1 & 0
        }
    });
});

module.exports = router;