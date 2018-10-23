import { Card } from '../card/card';


export class SpiderSlot {
  constructor() {
    this.cards = [];
  }

  fill(deck, i) {
    if (i < 4) {
      for (let j = 0; j < 6; j++) {
        let card = deck.cards.pop();
        card.returned = j < 5;
        this.cards.push(card);
      }
    } else {
      for (let j = 0; j < 5; j++) {
        let card = deck.cards.pop();
        card.returned = j < 4;
        this.cards.push(card);
      }
    }
  }

  canGetFrom(index) {
    if (this.cards.length > 0) {
      let firstReturnedCardIndex = this.cards.indexOf(this.cards.find(c => !c.returned));
      let selectedCards = this.cards.filter((c, i) => i >= index);
      for (let i = 0; i < selectedCards.length; i++) {
        if (i !== selectedCards.length - 1) {
          if (selectedCards[i].value - 1 !== selectedCards[i + 1].value || !selectedCards[i].isSameSuit(selectedCards[i + 1])) {
            return false;
          }
        }
      }
      return index >= firstReturnedCardIndex && index <= this.cards.length - 1;
    }
    return false;
  }

  canMoveTo(src) {
    if (this.cards.length > 0) {
      return src[0].value + 1 === this.cards[this.cards.length - 1].value;
    }
    return true;
  }

  unselect() {
    this.cards.forEach(card => card.selected = false);
  }

  dump() {
    return this.cards.map(c => ({
      suit: c.suit,
      name: c.name,
      returned: c.returned
    }));
  }

  load(cards) {
    this.cards = [];
    this.cards = cards.map(c => Card.fromObject(c));
  }

}
