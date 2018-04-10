export class kingSlot {

  constructor() {
    this.kingSlot = [];
  }

  canGetFrom(index) {
    return index === this.kingSlot.length - 1 && this.kingSlot[index] !== undefined ? true : false;
  }

  canMoveTo(src) {
    if (src.length === 1) {
      return this.kingSlot.length === 0 && src[0].value === 1 || this.kingSlot.length > 0 && src.suit === this.kingSlot[this.kingSlot.length - 1].suit && src.value === this.kingSlot[this.kingSlot.length - 1].value + 1 ? true : false;
    }
    return false;
  }
}
