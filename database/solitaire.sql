CREATE TABLE Player(
	email Varchar(25),
	username Varchar(25),
	password Varchar(200),
	country Varchar(30),
	birthday Varchar(32),
	gender Int,
	creation_date Date,
	points Int,
	player_level Int,
	games_played Int,
	games_won Int,
	user_rank Int,
	user_status Int,
	PRIMARY KEY(email)
);

CREATE TABLE Game(
	session_id  Int,
	game_id TEXT,
	game_status Int,
    game_date Date,
    email varchar(25) REFERENCES Player(email),
    PRIMARY KEY(session_id)
);