import { computedFrom } from 'aurelia-framework';
import { SUITS } from 'models/card-const';

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

  constructor(suit, name, value) {
    this.suit = suit;
    this.name = name;
    this.value = value;
    this.color = SUITS.indexOf(suit);
    //css related
    this.rank = name.toLowerCase();
    this.suitCss = `&${this.suit};`;
    this.selected = false;
    this.returned = false;
  }

  @computedFrom('returned', 'selected')
  get cardCss() {
    let css = 'card ';
    css += ((this.returned) ? 'back' : `rank-${this.rank} ${this.suit}`);
    if (this.selected) css += ' selected-card';
    return css;
  }

  isSameColor(cardToCompare) {
    return this.color % 2 === cardToCompare.color % 2;
  }

}
