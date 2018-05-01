let express = require('express');
let db = require('../dbconnection');

const REQUESTS = {
    getRankings: (cb) => {
        return db.query("SELECT username,points,player_level,games_played,games_won FROM player ORDER BY points DESC LIMIT 25", cb);
    }
};

let router = express.Router();

// save game
// PUT /api/games/
router.get('/', (req, res, next) => {
    REQUESTS.getRankings((err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json(rows); //or return count for 1 & 0
        }
    });
});

module.exports = router;