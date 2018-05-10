CREATE TABLE Player(
	email Varchar(80),
	username Varchar(25),
	password Varchar(200),
	country Varchar(30),
	birthday Varchar(32),
	gender Int,
	creation_date Date,
	points Int,
	games_played Int,
	games_won Int,
	user_rank Int,
	user_status Int,
	PRIMARY KEY(email)
);

CREATE TABLE Game(
	session_id  Int,
	game_id JSON,
	game_status Int,
    game_date Date,
	game_score Int,
    email varchar(80) REFERENCES Player(email),
    PRIMARY KEY(session_id)
);

CREATE PROCEDURE newGame(IN email VARCHAR(80))
 BEGIN
 UPDATE player SET games_played=games_played+1 WHERE email=email;
 UPDATE game SET game_status=0 WHERE email=email AND game_status=1;
 INSERT INTO game (game_id,game_status,game_date,game_score,email) VALUES ('{}',1,NOW(),1500,email);
 END;

CREATE PROCEDURE endGame(IN email VARCHAR(80), score INT)
 BEGIN
 UPDATE player SET games_won=games_won+1,points=points+score WHERE email=email;
 UPDATE game SET game_status=2,game_score=score WHERE email=email AND game_status=1;
 END;