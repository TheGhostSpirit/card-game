import { computedFrom } from 'aurelia-framework';
import { SUITS, SUITSYMBOLS, NAMES } from './solitaire-const';

/**
 * Describes a playable game card.
*/
export class Card {

  /**
   * Creates an instance of the Card class.
   * @param {String} suit - the suit of the card
   * @param {String} name - the name of the card
   */
  constructor(suit, name) {
    this.suit = suit;
    this.name = name;
    this.value = NAMES.indexOf(name) + 1;
    this.color = SUITS.indexOf(suit);
    this.suitSymbol = SUITSYMBOLS[this.color];
    //css related
    this.rank = this.name.toLowerCase();
    this.suitCss = `&${this.suit};`;
    this.selected = false;
    this.returned = false;
    this.symbol = `${this.name}${this.suitSymbol}`;
    this.id = Math.random().toString(10).slice(-8);
  }

  static fromObject(jsonCard) {
    let card = new Card(jsonCard.suit, jsonCard.name);
    card.returned = jsonCard.returned || false;
    return card;
  }

  @computedFrom('returned', 'selected')
  get cardCss() {
    let css = 'card ';
    css += ((this.returned) ? 'back' : `rank-${this.rank} ${this.suit}`);
    if (this.selected) {
      css += ' selected-card';
    }
    return css;
  }

  isSameColor(cardToCompare) {
    return this.color % 2 === cardToCompare.color % 2;
  }

  isSameSuit(cardToCompare) {
    return this.suit === cardToCompare.suit;
  }

  isEqual(cardToCompare) {
    return this.suit === cardToCompare.suit && this.name === cardToCompare.name;
  }

}
