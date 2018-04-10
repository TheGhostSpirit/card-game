export class Slot {

  constructor() {
    this.slot = [];
  }

  canGetFrom(index) {
    if (this.slot.length > 0) {
      for (let i = 0; i < this.slot.length; i++) {
        if (this.slot[i].returned === false) {
          break;
        }
      }
      return index >= i && index <= this.slot.length - 1 ? true : false;
    }
    return false;
  }

  canMoveTo(src) {
    if (this.slot.length > 0) {
      return src[0].value + 1 === this.slot[length - 1].value && ((this.slot[length - 1].suit % 2 === 1 && src[0].suit % 2 === 0) || (this.slot[length - 1].suit % 2 === 0 && src[0].suit % 2 === 1)) ? true : false;
    }
    return src[0].value === 13 ? true : false;
  }
}
