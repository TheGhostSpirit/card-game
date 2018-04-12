export class KingSlot {

  constructor() {
    this.cards = [];
  }

  canGetFrom(index) {
    return index === this.cards.length - 1 && typeof this.cards[index] !== 'undefined' ? true : false;
  }

  canMoveTo(src) {
    if (src.length === 1) {
      return this.cards.length === 0 && src[0].value === 1 || this.cards.length > 0 && src[0].suit === this.cards[this.cards.length - 1].suit && src[0].value === this.cards[this.cards.length - 1].value + 1 ? true : false;
    }
    return false;
  }
}
