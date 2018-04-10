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

  moveCardFromSlotToSlot(cardIndex, slotIndex, zone) {
    //if the user already clicked on a card
    if (typeof this.previousCardIndex !== 'undefined') {
      // Destination condition
      //if move is correct
      if (this.canBeMoved(this.previousCardIndex, cardIndex, this.previousSlotIndex, slotIndex) === true) {
        this.selectCards(this.previousCardIndex, this.previousSlotIndex); //desel
      } else {
        this.selectCard(this.previousCardIndex, this.previousSlotIndex); //desel
      }
      this.previousCardIndex = undefined;
      //if the user didn't click on a card or wrong card
    } else {
      // Source condition
      let sourceSlot = getSlot(slotIndex, zone);
      if (sourceSlot.canGetFrom(cardIndex))  {
        this.previousCardIndex = cardIndex;
        this.previousSlotIndex = slotIndex;
        this.selectCards(cardIndex, slotIndex);
      }
    }
  }

  getSlot(slotIndex, zone) {
    return undefined;
  }

  selectCards(card, slot) {
    do {
      this.selectCard(this.slots[slot][card]);
      card++;
    } while (card !== this.slots[slot].length - 1);
  }

  selectCard(card) {
    card.selected = !card.selected;
  }

  returnCard(card) {
    card.returned = !card.returned;
  }

}
