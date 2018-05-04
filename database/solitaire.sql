CREATE TABLE Player(
	email Varchar(80),
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
    email varchar(80) REFERENCES Player(email),
    PRIMARY KEY(session_id)
);

CREATE PROCEDURE newGame(IN email VARCHAR(25))
 BEGIN
 UPDATE player SET games_played=games_played+1 WHERE email=email;
 UPDATE game SET game_status=0 WHERE email=email AND game_status=1;
 INSERT INTO game (game_id,game_status,game_date,email) VALUES (0,1,NOW(),email);
 END;