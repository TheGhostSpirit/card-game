import { inject } from 'aurelia-framework';
import { Deck } from 'models/deck';
import { Stub } from 'models/stub';
import { KingSlot } from 'models/king-slot';
import { Slot } from 'models/slot';

const ZONES = Object.freeze({ slots: 0, kingSlots: 1, stub: 2 });

@inject(Deck)
export class Solitaire {

  constructor(deck) {
    this.deck = deck;
    this.zones = ZONES;
    this.kingSlots = [];
    this.stub = new Stub();
    this.slots = [];
    this.previousSelection = undefined;
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
    if (typeof this.previousSelection !== 'undefined') {
      // Destination condition
      let destinationSlot = this.getSlot(slotIndex, zone);
      let src = this.getCards(this.previousSelection);
      //if move is correct
      this.selectCards(this.previousSelection); //desel
      if (destinationSlot.canMoveTo(src)) {
        src.forEach(c => {
          this.previousSelection.slot.cards.splice(this.previousSelection.index, src.length);
          destinationSlot.cards.push(c);
        });
        let test = this.previousSelection.slot.cards.find(c => !c.returned);
        if (this.previousSelection.zone === ZONES.slots && this.previousSelection.slot.cards.length > 0 && typeof this.previousSelection.slot.cards.find(c => !c.returned) === 'undefined') this.returnCard(this.previousSelection.slot.cards[this.previousSelection.slot.cards.length - 1]);
      }
      this.previousSelection = undefined;
      //if the user didn't click on a card or wrong card
    } else {
      // Source condition
      let sourceSlot = this.getSlot(slotIndex, zone);
      if (sourceSlot.canGetFrom(cardIndex)) {
        this.previousSelection = { slot: sourceSlot, index: cardIndex, zone: zone };
        this.selectCards(this.previousSelection);
      }
    }
  }

  getSlot(slotIndex, zone) {
    if (zone === ZONES.slots) {
      return this.slots[slotIndex];
    } else if (zone === ZONES.kingSlots) {
      return this.kingSlots[slotIndex];
    }
    return this.stub;
  }

  getCards(cardsSelection) {
    return cardsSelection.slot.cards.filter((c, i) => i >= cardsSelection.index);
  }

  selectCards(cardsSelection) {
    this.getCards(cardsSelection).forEach(this.selectCard);
  }

  selectCard(card) {
    card.selected = !card.selected;
  }

  returnCard(card) {
    card.returned = !card.returned;
  }
}
