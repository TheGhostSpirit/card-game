import { inject } from 'aurelia-framework';
import { Deck } from 'models/deck';
import { Stub } from 'models/stub';
import { KingSlot } from 'models/king-slot';
import { Slot } from 'models/slot';
import { Service } from 'services/service';
import { User } from 'models/user';

const ZONES = Object.freeze({ slots: 0, kingSlots: 1, stub: 2 });

@inject(Deck, Service, User)
export class Solitaire {

  constructor(deck, service, user) {
    this.service = service;
    this.deck = deck;
    this.zones = ZONES;
    this.user = user;
  }

  newGame() {
    this.initialize();
    this.deck.initialize();
    this.distributeFromDeck(this.deck);
  }

  restoreGame() {
    this.initialize();
    let savedGame;
    this.service.restoreGame(this.user.email).then(result => savedGame = result.savedGame);
    this.restore(savedGame);
  }

  /**
   * Initializes the internal structures of the game.
   */
  initialize() {
    this.isNotFinished = true;
    this.previousSelection = undefined;
    this.kingSlots = [];
    this.stub = new Stub();
    this.slots = [];
    for (let i = 0; i < 7; i++) {
      this.slots.push(new Slot());
    }
    for (let i = 0; i < 4; i++) {
      this.kingSlots.push(new KingSlot());
    }
  }

  /**
   * Distributes the cards of the specified deck on the table.
   * @param {Deck} deck - the deck used to distribute cards.
   */
  distributeFromDeck(deck) {
    deck.shuffle();
    for (let i = 0; i < 7; i++) {
      this.slots[i].fill(deck, i);
    }
    this.stub.fill(deck);
  }

  removeSelection() {
    this.previousSelection = undefined;
  }

  /**
   * Restores the cards from a saved game on the table.
   */
  restore(savedGame) {
    this.kingSlots.forEach((s, index) => s.load(savedGame.kingSlots[index]));
    this.slots.forEach((s, index) => s.load(savedGame.slots[index]));
    this.stub.load(savedGame.stub);
  }

  /**
   * Resets the game.
   */
  reset() {
    // TODO: warn user before reseting !!
    this.initialize();
    this.deck.initialize();
    this.distributeFromDeck(this.deck);
  }

  /**
   * Saves the currently played game.
   */
  save() {
    let email = this.user.email;
    this.service.saveGame(email, this.dump());
  }

  /**
   * Creates a dump of the solitaire game.
   */
  dump() {
    return {
      slots: this.slots.map(s => s.dump()),
      kingSlots: this.kingSlots.map(s => s.dump()),
      stub: this.stub.dump()
    };
  }

  cheat() {
    this.initialize();
    let cheatedGame = JSON.parse('{"kingSlots":[[{"suit":"hearts","name":"A"},{"suit":"hearts","name":"2"},{"suit":"hearts","name":"3"},{"suit":"hearts","name":"4"},{"suit":"hearts","name":"5"},{"suit":"hearts","name":"6"},{"suit":"hearts","name":"7"},{"suit":"hearts","name":"8"},{"suit":"hearts","name":"9"},{"suit":"hearts","name":"10"},{"suit":"hearts","name":"J"},{"suit":"hearts","name":"Q"},{"suit":"hearts","name":"K"}],[{"suit":"spades","name":"A"},{"suit":"spades","name":"2"},{"suit":"spades","name":"3"},{"suit":"spades","name":"4"},{"suit":"spades","name":"5"},{"suit":"spades","name":"6"},{"suit":"spades","name":"7"},{"suit":"spades","name":"8"},{"suit":"spades","name":"9"},{"suit":"spades","name":"10"},{"suit":"spades","name":"J"},{"suit":"spades","name":"Q"},{"suit":"spades","name":"K"}],[{"suit":"clubs","name":"A"},{"suit":"clubs","name":"2"},{"suit":"clubs","name":"3"},{"suit":"clubs","name":"4"},{"suit":"clubs","name":"5"},{"suit":"clubs","name":"6"},{"suit":"clubs","name":"7"},{"suit":"clubs","name":"8"},{"suit":"clubs","name":"9"},{"suit":"clubs","name":"10"},{"suit":"clubs","name":"J"},{"suit":"clubs","name":"Q"},{"suit":"clubs","name":"K"}],[{"suit":"diams","name":"A"},{"suit":"diams","name":"2"},{"suit":"diams","name":"3"},{"suit":"diams","name":"4"},{"suit":"diams","name":"5"},{"suit":"diams","name":"6"},{"suit":"diams","name":"7"},{"suit":"diams","name":"8"},{"suit":"diams","name":"9"},{"suit":"diams","name":"10"}]],"stub":{"cards":[{"suit":"diams","name":"J"}],"returnedCards":[{"suit":"diams","name":"Q","returned":true}]},"slots":[[{"suit":"diams","name":"K"}],[],[],[],[],[],[]]}');
    this.restore(cheatedGame);
  }

  setSelectedCardIndex(cardIndex) {
    this.selectedCardIndex = cardIndex;
  }

  moveCard(cardIndex, slotIndex, zone) {
    if (cardIndex === -1) cardIndex = this.selectedCardIndex;
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
        //let test = this.previousSelection.slot.cards.find(c => !c.returned);
        if (this.previousSelection.zone === ZONES.slots && this.previousSelection.slot.cards.length > 0 && typeof this.previousSelection.slot.cards.find(c => !c.returned) === 'undefined') {
          this.returnCard(this.previousSelection.slot.cards[this.previousSelection.slot.cards.length - 1]);
        }
        this.isNotFinished = this.kingSlots.some(s => !s.isFull());
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

  turnStub() {
    //unselect at a graphical level
    this.slots.forEach(slot => slot.unselect());
    this.kingSlots.forEach(kingSlot => kingSlot.unselect());
    this.stub.unselect();
    // remove stub selection if applicable
    this.removeSelection();
    this.stub.turn();
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
