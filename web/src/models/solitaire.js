import { inject } from 'aurelia-framework';
import { Deck } from 'models/deck';
import { Stub } from 'models/stub';
import { KingSlot } from 'models/king-slot';
import { Slot } from 'models/slot';

const ZONES = ['slots', 'stub', 'kingSlots'];

@inject(Deck)
export class Solitaire {

  constructor(deck) {
    this.deck = deck;
    this.zones = ZONES;
    this.kingSlots = [];
    this.stub = new Stub();
    this.slots = [];
    this.previousSlotIndex = undefined;
    this.previousCardIndex = undefined;
    this.previousZone = undefined;
    this.prepare();
  }

  prepare() {
    this.deck.shuffle();
    this.fillSlots();
    this.fillStub();
    this.prepareKingSlots();
  }

  fillSlots() {
    for (let i = 0; i < 7; i++) this.slots.push(new Slot());
    for (let i = 0; i < 7; i++) {
      this.slots[i].fill(this.deck, i);
    }
  }

  fillStub() {
    this.stub.fill(this.deck);
  }

  prepareKingSlots() {
    for (let i = 0; i < 4; i++) {
      this.kingSlots.push(new KingSlot());
    }
  }

  moveCard(cardIndex, slotIndex, zone) {
    //if the user already clicked on a card
    if (typeof this.previousCardIndex !== 'undefined') {
      // Destination condition
      let destinationSlot = this.getSlot(slotIndex, zone);
      let src = this.getCards(cardIndex, slotIndex, zone);
      //if move is correct
      if (destinationSlot.canMoveTo(src)) {
        this.selectCards(this.previousCardIndex, this.previousSlotIndex); //desel
      } else {
        this.selectCards(this.previousCardIndex, this.previousSlotIndex); //desel
      }
      this.previousCardIndex = undefined;
      //if the user didn't click on a card or wrong card
    } else {
      // Source condition
      let sourceSlot = this.getSlot(slotIndex, zone);
      if (sourceSlot.canGetFrom(cardIndex)) {
        this.previousCardIndex = cardIndex;
        this.previousSlotIndex = slotIndex;
        this.selectCards(cardIndex, slotIndex);
      }
    }
  }

  getSlot(slotIndex, zone) {
    console.log(zone);
    return this.slots[slotIndex];
  }

  getCards(cardIndex, slotIndex, zone) {
    let slot = this.getSlot(slotIndex, zone);
    let arr = [];
    for (let i = cardIndex; i < slot.length; i++) {
      arr.push(slot[i]);
    }
    return arr;
  }

  selectCards(cardIndex, slotIndex) {
    do {
      this.selectCard(this.slots[slotIndex][cardIndex]);
      cardIndex++;
    } while (cardIndex !== this.slots[slotIndex].length - 1);
  }

  selectCard(card) {
    card.selected = !card.selected;
  }

  returnCard(card) {
    card.returned = !card.returned;
  }
}
