/** 
 * Describes a playable game card.
*/
export class Card {
  
  /**
   * Creates an instance of the Card class.
   * @param {String} suit - the suit of the card
   * @param {String} name - the name of the card
   * @param {Number} value - the value of the card
   */
  
  constructor(suit, name, value){
    this.suit = suit;
    this.name = name;
    this.value = value;
    this.rank = name.toLowerCase();
    this.cssSuit = `&${this.suit};`;
  }
}
