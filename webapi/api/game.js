let express = require('express');
let db = require('../dbconnection');

const REQUESTS = {
    saveGame: (email, savedGame, cb) => {
        return db.query("UPDATE game SET game_id=? WHERE email=? AND game_status=1", [savedGame, email], cb);
    },
    newGame: (email, cb) => {
        return db.query("CALL newGame(?)", email, cb);
    },
    restoreGame: (email, cb) => {
        return db.query("SELECT game_id FROM game WHERE email=? AND game_status=1", email, cb);
    },
    endGame: (email, cb) => {
        /*return [
            db.query("UPDATE player SET games_won=games_won+1 WHERE email =?", email, cb),
            db.query("UPDATE game SET game_status=2 WHERE email=? AND game_status=1", email, cb)
        ]; --> change this to a storedproc.*/
    }
};

let router = express.Router();

// save game
// PUT /api/games/save
router.put('/save', (req, res, next) => {
    let save = req.body;
    REQUESTS.saveGame(save.email, save.savedGame, (err, rows) => {
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

router.get('/restore', (req, res, next) => {
    REQUESTS.restoreGame(req.body.email, (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });
});

router.put('/end', (req, res, next) => {
    let save = req.body;
    REQUESTS.saveGame(req.body.email, (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json({ status: true }); 
        }
    });
});
// restore game
// GET /api/games/

// get rankings
// GET /api/games/rankings

// new game
// POST /api/games

//end game
// PUT /api/games/end

// PUT /api/game/454
//router.put('/:id', (re))

module.exports = router;