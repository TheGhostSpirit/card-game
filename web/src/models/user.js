export class User {

  constructor() {
    this.status;
    this.email;
    this.username;
    this.points;
    this.score;
    this.level;
    this.progression;
    this.amountToNext;
    this.percentage;
    this.games_won;
    this.games_played;
  }

  pointsToLevel() {
    this.progression = this.points;
    let baseValue = 250;
    this.amountToNext = baseValue;
    this.level = 1;
    while (this.progression > this.amountToNext) {
      this.progression -= this.amountToNext;
      this.level++;
      this.amountToNext *= 2;
    }
    this.percentage = (this.progression / this.amountToNext) * 100;
  }
}
