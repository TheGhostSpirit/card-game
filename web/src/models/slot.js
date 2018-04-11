export class Slot {

  constructor() {
    this.cards = [];
  }

  canGetFrom(index) {
    if (this.cards.length > 0) {
      for (var i = 0; i < this.cards.length; i++) {
        if (this.cards[i].returned === false) {
          break;
        }
      }
      return index >= i && index <= this.cards.length - 1 ? true : false;
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
