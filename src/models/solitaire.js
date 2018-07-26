import { inject } from 'aurelia-framework';
import { Deck } from 'models/deck';
import { Stub } from 'models/stub';
import { KingSlot } from 'models/king-slot';
import { Slot } from 'models/slot';
import { Router } from 'aurelia-router';
import { Move } from './move';

const ZONES = Object.freeze({ slots: 0, kingSlots: 1, stub: 2 });

@inject(Deck, Router)
export class Solitaire {

  constructor(deck, router) {
    this.deck = deck;
    this.zones = ZONES;
    this.router = router;
  }

  quit() {
    this.router.navigateToRoute('Menu');
  }

  newGame() {
    this.initialize();
    this.deck.initialize();
    this.distributeFromDeck(this.deck);
  }

  auto() {
    this.newGame();
    this.findSolutions();
  }
  /**
   * Initializes the internal structures of the game.
   */
  initialize() {
    this.autoSolve = false;
    this.isNotFinished = true;
    this.previousSelection = undefined;
    this.kingSlots = [];
    this.moves = [];
    this.solutions = [];
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
    let game = savedGame.game;
    this.kingSlots.forEach((s, index) => s.load(game.kingSlots[index]));
    this.slots.forEach((s, index) => s.load(game.slots[index]));
    this.stub.load(game.stub);
  }

  /**
   * Resets the game.
   */
  reset() {
    // TODO: warn user before reseting !!
    this.newGame();
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
    let cheatedGame = JSON.parse('{"game":{"kingSlots":[[{"suit":"hearts","name":"A"},{"suit":"hearts","name":"2"},{"suit":"hearts","name":"3"},{"suit":"hearts","name":"4"},{"suit":"hearts","name":"5"},{"suit":"hearts","name":"6"},{"suit":"hearts","name":"7"},{"suit":"hearts","name":"8"},{"suit":"hearts","name":"9"},{"suit":"hearts","name":"10"},{"suit":"hearts","name":"J"},{"suit":"hearts","name":"Q"},{"suit":"hearts","name":"K"}],[{"suit":"spades","name":"A"},{"suit":"spades","name":"2"},{"suit":"spades","name":"3"},{"suit":"spades","name":"4"},{"suit":"spades","name":"5"},{"suit":"spades","name":"6"},{"suit":"spades","name":"7"},{"suit":"spades","name":"8"},{"suit":"spades","name":"9"},{"suit":"spades","name":"10"},{"suit":"spades","name":"J"},{"suit":"spades","name":"Q"},{"suit":"spades","name":"K"}],[{"suit":"clubs","name":"A"},{"suit":"clubs","name":"2"},{"suit":"clubs","name":"3"},{"suit":"clubs","name":"4"},{"suit":"clubs","name":"5"},{"suit":"clubs","name":"6"},{"suit":"clubs","name":"7"},{"suit":"clubs","name":"8"},{"suit":"clubs","name":"9"},{"suit":"clubs","name":"10"},{"suit":"clubs","name":"J"},{"suit":"clubs","name":"Q"},{"suit":"clubs","name":"K"}],[{"suit":"diams","name":"A"},{"suit":"diams","name":"2"},{"suit":"diams","name":"3"},{"suit":"diams","name":"4"},{"suit":"diams","name":"5"},{"suit":"diams","name":"6"},{"suit":"diams","name":"7"},{"suit":"diams","name":"8"},{"suit":"diams","name":"9"},{"suit":"diams","name":"10"}]],"stub":{"cards":[{"suit":"diams","name":"J"}],"returnedCards":[{"suit":"diams","name":"Q","returned":true}]},"slots":[[{"suit":"diams","name":"K"}],[],[],[],[],[],[]]}}');
    this.restore(cheatedGame);
  }

  setSelectedCardIndex(cardIndex) {
    this.selectedCardIndex = cardIndex;
  }

  moveCard(cardIndex, slotIndex, zone) {
    if (cardIndex === -1) cardIndex = this.selectedCardIndex; //getting the index of the clicked card in the slot
    if (typeof this.previousSelection !== 'undefined') { //if the user already clicked on a card
      let destinationSlot = this.getSlot(slotIndex, zone); //gets the target slot from index and zone
      let src = this.getCards(this.previousSelection); //gets the selected cards
      this.selectCards(this.previousSelection); //deselect cards
      if (destinationSlot.canMoveTo(src)) { //move cards(s) from one array to another if canMoveTo is valid
        this.previousSelection.slot.cards.splice(this.previousSelection.index, src.length);
        src.forEach(c => {
          destinationSlot.cards.push(c);
        });
        this.cardWasTurned = false;
        this.returnsNextCardInSlot(); //returns next card in slot if move was made from slot with returned cards
        this.moves.push(new Move(this.previousSelection.slot.cards, destinationSlot.cards, src, this.cardWasTurned)); //keeps a track of the moves to undo them later
        this.canAutoSolve();
        this.isNotFinished = this.kingSlots.some(s => !s.isFull());//checks if game is over
      }
      this.previousSelection = undefined;
    } else { //if the user didn't click on a card or wrong card
      let sourceSlot = this.getSlot(slotIndex, zone); //gets the target slot from the its index and zone
      if (sourceSlot.canGetFrom(cardIndex)) {  //checks if the cards can be moved from here
        this.previousSelection = { slot: sourceSlot, index: cardIndex, zone: zone }; //keeps a track of the selection for the upcoming move
        this.selectCards(this.previousSelection); //sets selected property to true for the CSS to render selection properly
      }
    }
  }

  returnsNextCardInSlot() {
    if (this.previousSelection.zone === ZONES.slots && this.previousSelection.slot.cards.length > 0 && typeof this.previousSelection.slot.cards.find(c => !c.returned) === 'undefined') {
      this.returnCard(this.previousSelection.slot.cards[this.previousSelection.slot.cards.length - 1]);
      this.cardWasTurned = true;
    }
  }

  undoMove() {
    /* Fix: removes any selection to avoid selection duplication bug */
    this.slots.forEach(slot => slot.unselect());
    this.kingSlots.forEach(kingSlot => kingSlot.unselect());
    this.stub.unselect();
    this.previousSelection = undefined;
    /* End  of fix */
    if (this.moves.length > 0) {
      let lastMove = this.moves[this.moves.length - 1];
      if (!lastMove.stub) {
        if (lastMove.cardWasTurned) {
          this.returnCard(lastMove.source[lastMove.source.length - 1]);
        }
        let cards = lastMove.destination.splice(-lastMove.selection.length, lastMove.selection.length);
        cards.forEach(c => lastMove.source.push(c));
      } else {
        this.stub.undoMove();
      }
      this.moves.pop();
    } else {
      alert('Nothing left to undo!');
    }
  }

  canAutoSolve() {
    if (this.stub.cards.length === 0 && this.stub.returnedCards.length === 0 && this.slots.every((s) => s.cards.every(c => !c.returned))) {
      this.autoSolve = true;
    }
  }

  autoSolveGame() {
    this.isNotFinished = false;
  }

  turnStub() {
    //unselect at a graphical level
    this.slots.forEach(slot => slot.unselect());
    this.kingSlots.forEach(kingSlot => kingSlot.unselect());
    this.stub.unselect();
    // remove stub selection if applicable
    this.removeSelection();
    this.stub.turn();
    this.moves.push({ stub: true });
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

  findSolutions() {
    let stubToSlot = [];
    let stubToKingCell = [];
    for (let i = 0; i < 7; i++) {
      stubToSlot.push(this.stub.returnedCards.filter(c => this.slots[i].canMoveTo([c])));
    }
    for (let i = 0; i < 4; i++) {
      stubToKingCell.push(this.stub.returnedCards.filter(c => this.kingSlots[i].canMoveTo([c])));
    }
  }
}
