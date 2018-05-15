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
	session_id  Int AUTO_INCREMENT,
	game_id JSON,
	game_status Int,
    game_date Date,
	game_score Int,
    email varchar(80) REFERENCES Player(email),
    PRIMARY KEY(session_id)
);

CREATE TABLE Challenge(
	id_challenge int AUTO_INCREMENT,
	game JSON,
	PRIMARY KEY(id_challenge)
);

CREATE TABLE Do_Challenge(
	id_session int AUTO_INCREMENT,
	email varchar(80) REFERENCES Player(email),
	id_challenge int REFERENCES Challenge(id_challenge),
	challenge_score int,
	challenge_status int,
	PRIMARY KEY(id_session)
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

CREATE PROCEDURE newChallenge(IN email VARCHAR(80))
 BEGIN
 UPDATE do_challenge SET challenge_status = 0 WHERE challenge_status = 1 AND email = email;
 INSERT INTO do_challenge(email,id_challenge,challenge_score,challenge_status) VALUES (email,(SELECT MAX(id_challenge) from challenge),3000,1);
 END;

CREATE PROCEDURE endChallenge(IN email VARCHAR(80), score INT)
 BEGIN
 UPDATE player SET points=points+score WHERE email=email;
 UPDATE do_challenge SET challenge_status=2,challenge_score=score WHERE email=email AND challenge_status=1;
 END;