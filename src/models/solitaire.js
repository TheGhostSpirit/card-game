import { inject } from 'aurelia-framework';
import { Deck } from './deck';
import { Stub } from './stub';
import { KingSlot } from './king-slot';
import { Slot } from './slot';
import { SUITS, ZONES } from './solitaire-const';
import { Move } from './move';

@inject(Deck)
export class Solitaire {

  constructor(deck) {
    this.deck = deck;
    this.zones = ZONES;
    this.logger = console;
    this.initialize();
  }

  /**
   * Initializes the internal structures of the game.
   */
  initialize() {
    this.isNotFinished = true;
    this.previousSelection = undefined;
    this.kingSlots = [];
    this.moves = [];
    this.stub = new Stub();
    this.slots = [];
    for (let i = 0; i < 7; i++) {
      this.slots.push(new Slot(i));
    }
    for (let i = 0; i < 4; i++) {
      this.kingSlots.push(new KingSlot(SUITS[i]));
    }
  }

  /**
   * Generates a new game.
   */
  newGame() {
    this.initialize();
    this.deck.initialize();
    this.distributeFromDeck(this.deck);
  }

  /**
   * Loads the specified game.
   */
  loadGame(game) {
    if (game) {
      this.initialize();
      this.restore(game);
    } else {
      this.newGame();
    }
  }

  /**
   * Creates a memory dump of the game.
   */
  dump() {
    return {
      kingSlots: this.kingSlots.map(s => s.dump()),
      slots: this.slots.map(s => s.dump()),
      stub: this.stub.dump()
    };
  }

  /**
   * Restores the cards from a saved game.
   */
  restore(game) {
    this.kingSlots.forEach((s, index) => s.load(game.kingSlots[index]));
    this.slots.forEach((s, index) => s.load(game.slots[index]));
    this.stub.load(game.stub);
  }

  /**
   * Writes the memory dump to console.
   */
  logJson() {
    this.logger.log(JSON.stringify(this.dump()));
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

  setSelectedCardIndex(cardIndex) {
    this.selectedCardIndex = cardIndex;
  }

  moveCard(cardIndex, slotIndex, zone) { //move called byt the user from the view
    if (cardIndex === -1) cardIndex = this.selectedCardIndex; //getting the index of the clicked card in the slot
    if (typeof this.previousSelection !== 'undefined') { //if the user already clicked on a card
      let destinationSlot = this.getSlot(slotIndex, zone); //gets the target slot from index and zone
      let src = this.getCards(this.previousSelection); //gets the selected cards
      this.selectCards(this.previousSelection); //deselect cards
      if (destinationSlot.canMoveTo(src)) { //move cards(s) from one array to another if canMoveTo is valid
        this.doMove(this.previousSelection.slot.cards, destinationSlot.cards, src, this.previousSelection.zone);
        this.isNotFinished = this.isGameNotFinished(); //checks if game is over
      }
      this.previousSelection = undefined;
    } else { //if the user didn't click on a card or wrong card
      let sourceSlot = this.getSlot(slotIndex, zone); //gets the target slot from the its index and zone
      if (sourceSlot.canGetFrom(cardIndex)) { //checks if the cards can be moved from here
        this.previousSelection = {
          slot: sourceSlot,
          index: cardIndex,
          zone: zone
        }; //keeps a track of the selection for the upcoming move
        this.selectCards(this.previousSelection); //sets selected property to true for the CSS to render selection properly
      }
    }
  }

  doMove(source, destination, selection, zone) { //move called from the engine
    let beforeState = this.dump();
    selection.forEach(c => {
      source.splice(source.findIndex(sc => sc.isEqual(c)), 1);
      destination.push(c);
    });
    this.returnNextCardInSlot(source, zone);
    this.moves.push(beforeState); //keeps a track of the moves to undo them later
  }

  returnNextCardInSlot(source, zone) {
    if (zone === ZONES.slots && source.length > 0 && typeof source.find(c => !c.returned) === 'undefined') {
      this.returnCard(source[source.length - 1]);
    }
  }

  undoMove() {
    if (this.moves.length > 0) {
      this.restore(this.moves.pop());
    }
  }

  turnStub() {
    //unselect at a graphical level
    this.slots.forEach(slot => slot.unselect());
    this.kingSlots.forEach(kingSlot => kingSlot.unselect());
    this.stub.unselect();
    // remove stub selection if applicable
    this.removeSelection();
    let beforeState = this.dump();
    this.moves.push(beforeState);
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

  isGameNotFinished() {
    return this.kingSlots.some(s => !s.isFull());
  }

  findMoves() {
    let moves = [];
    let kingSlotNumber = 4;
    let slotNumber = 7;
    for (let i = 0; i < kingSlotNumber; i++) {
      for (let j = 0; j < slotNumber; j++) {
        let c = this.slots[j].cards[this.slots[j].cards.length - 1];
        if (c && this.kingSlots[i].canMoveTo([c])) {
          moves.push(
            new Move(
              this.slots[j],
              this.kingSlots[i],
              [c],
              `${c.symbol}:slot${j + 1}->kingslot`,
              ZONES.slots
            )
          );
        }
      }
    }
    for (let i = 0; i < kingSlotNumber; i++) {
      this.stub.cards.filter(c => this.kingSlots[i].canMoveTo([c])).forEach(c => moves.push(
        new Move(
          this.stub,
          this.kingSlots[i],
          [c],
          `${c.symbol}:stub->kingslot`
        )
      ));
    }
    for (let i = 0; i < slotNumber; i++) {
      let p = this.slots[i].cards.length - this.slots[i].cards.findIndex(c => !c.returned);
      for (let j = 1; j <= p; j++) {
        let selection = this.slots[i].cards.filter((c, ind) => ind >= this.slots[i].cards.length - p);
        if (selection.length === 0) continue; // empty selection
        let symbols = `(${selection.map(c => c.symbol).join('-')})`;
        for (let k = 0; k < slotNumber; k++) {
          let emptyDestinationSlot = this.slots[k].cards.length === 0;
          let kingSelection = selection[0].value === 13 && selection[0] === this.slots[i].cards[0];
          if (this.slots[k].canMoveTo(selection) && i !== k && !(emptyDestinationSlot && kingSelection)) {
            moves.push(
              new Move(
                this.slots[i],
                this.slots[k],
                selection,
                `${symbols}:slot${i + 1}->slot${k + 1}`,
                ZONES.slots
              )
            );
          }
        }
      }
    }
    for (let i = 0; i < slotNumber; i++) {
      this.stub.cards.filter(c => this.slots[i].canMoveTo([c])).forEach(c => moves.push(
        new Move(
          this.stub,
          this.slots[i],
          [c],
          `${c.symbol}:stub->slot${i + 1}`
        )
      ));
    }
    if (moves.length === 0) {
      for (let i = 0; i < kingSlotNumber; i++) {
        for (let j = 0; j < slotNumber; j++) {
          let emptyDestinationSlot = this.slots[j].cards.length === 0;
          if (emptyDestinationSlot) continue;
          let c = this.kingSlots[i].cards[this.kingSlots[i].cards.length - 1];
          if (c && this.slots[j].canMoveTo([c])) {
            moves.push(
              new Move(
                this.kingSlots[i],
                this.slots[j],
                [c],
                `${c.symbol}:kingslot->slot${j + 1}`,
                ZONES.kingSlots
              )
            );
          }
        }
      }
    }
    let map = new Map();
    moves.forEach(m => map.set(m.description, m));
    return Array.from(map.values());
  }

  prepareForResolution() {
    this.stub.fullTurn();
  }
}
