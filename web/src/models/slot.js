import { Card } from 'models/card';

export class Slot {

  constructor() {
    this.cards = [];
  }

  /**
    * Loads the slot with the specified cards array.
    * @param {Array<Card>} cards - the array of cards used to load the slot.
    */
  load(cards) {
    this.cards = [];
    if (typeof cards === 'undefined' || cards.length === 0) return;
    this.cards = cards.map(c => Card.fromObject(c));
  }

  /**
   * Creates a dump of the slot.
   */
  dump() {
    return this.cards.map(c => ({
      suit: c.suit,
      name: c.name,
      returned: c.returned
    }));
  }

  canGetFrom(index) {
    if (this.cards.length > 0) {
      let firstReturnedCardIndex = this.cards.indexOf(this.cards.find(c => !c.returned));
      return index >= firstReturnedCardIndex && index <= this.cards.length - 1 ? true : false;
    }
    return false;
  }

  canMoveTo(src) {
    let lastCard = this.cards[this.cards.length - 1];
    if (this.cards.length > 0) {
      return src[0].value + 1 === lastCard.value && !src[0].isSameColor(lastCard);
    }
    return src[0].value === 13 ? true : false;
  }

  fill(deck, i) {
    for (let j = 0; j < i + 1; j++) {
      let card = deck.cards.pop();
      card.returned = j !== i;
      this.cards.push(card);
    }
  }
}
