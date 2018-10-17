import { inject } from 'aurelia-framework';
import { SDeck } from './sdeck';
import { SStub } from './sstub';
import { SKingSlot } from './sking-slot';
import { SSlot } from './sslot';
import { SUITS, ZONES } from '../card/card-const';

@inject(SDeck)
export class SSolitaire {

  constructor(deck) {
    this.deck = deck;
    this.zones = ZONES;
    this.logger = console;
  }

  newGame() {
    this.initialize();
    this.deck.initialize();
    this.distributeFromDeck(this.deck);
  }

  /**
   * Initializes the internal structures of the game.
   */
  initialize() {
    this.isNotFinished = true;
    this.previousSelection = undefined;
    this.kingSlots = [];
    this.moves = [];
    this.stub = new SStub();
    this.slots = [];
    for (let i = 0; i < 3; i++) {
      this.slots.push(new SSlot());
    }
    this.kingSlots.push(new SKingSlot(SUITS[0]));
  }
  /**
   * Distributes the cards of the specified deck on the table.
   * @param {Deck} deck - the deck used to distribute cards.
   */
  distributeFromDeck(deck) {
    deck.shuffle();
    for (let i = 0; i < 3; i++) {
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
    let game = savedGame;
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
      kingSlots: this.kingSlots.map(s => s.dump()),
      slots: this.slots.map(s => s.dump()),
      stub: this.stub.dump()
    };
  }

  logJson() {
    this.logger.log(JSON.stringify(this.dump()));
  }

  // cheat() {
  //   this.initialize();
  //   let testGame2 = JSON.parse('{"kingSlots":[[],[],[],[]],"slots":[[{"suit":"hearts","name":"2","returned":false}],[{"suit":"diams","name":"8","returned":true},{"suit":"clubs","name":"5","returned":false}],[{"suit":"spades","name":"8","returned":true},{"suit":"hearts","name":"5","returned":true},{"suit":"spades","name":"3","returned":false}],[{"suit":"hearts","name":"K","returned":true},{"suit":"spades","name":"5","returned":true},{"suit":"diams","name":"K","returned":true},{"suit":"diams","name":"4","returned":false}],[{"suit":"clubs","name":"4","returned":true},{"suit":"diams","name":"J","returned":true},{"suit":"clubs","name":"2","returned":true},{"suit":"clubs","name":"7","returned":true},{"suit":"diams","name":"9","returned":false}],[{"suit":"spades","name":"J","returned":true},{"suit":"clubs","name":"9","returned":true},{"suit":"clubs","name":"3","returned":true},{"suit":"hearts","name":"7","returned":true},{"suit":"hearts","name":"J","returned":true},{"suit":"hearts","name":"6","returned":false}],[{"suit":"diams","name":"5","returned":true},{"suit":"spades","name":"Q","returned":true},{"suit":"diams","name":"A","returned":true},{"suit":"hearts","name":"4","returned":true},{"suit":"diams","name":"Q","returned":true},{"suit":"diams","name":"10","returned":true},{"suit":"spades","name":"9","returned":false}]],"stub":{"cards":[],"returnedCards":[{"suit":"spades","name":"2","returned":true},{"suit":"spades","name":"K","returned":true},{"suit":"clubs","name":"Q","returned":true},{"suit":"hearts","name":"A","returned":true},{"suit":"hearts","name":"8","returned":true},{"suit":"spades","name":"7","returned":true},{"suit":"clubs","name":"6","returned":true},{"suit":"hearts","name":"9","returned":true},{"suit":"spades","name":"A","returned":true},{"suit":"clubs","name":"10","returned":true},{"suit":"hearts","name":"Q","returned":true},{"suit":"spades","name":"4","returned":true},{"suit":"hearts","name":"3","returned":true},{"suit":"diams","name":"2","returned":true},{"suit":"spades","name":"10","returned":true},{"suit":"clubs","name":"A","returned":true},{"suit":"clubs","name":"J","returned":true},{"suit":"diams","name":"3","returned":true},{"suit":"hearts","name":"10","returned":true},{"suit":"diams","name":"6","returned":true},{"suit":"clubs","name":"K","returned":true},{"suit":"diams","name":"7","returned":true},{"suit":"clubs","name":"8","returned":true},{"suit":"spades","name":"6","returned":true}]}}');
  //   // let testGame1 = JSON.parse('{"kingSlots":[[],[],[],[]],"slots":[[{"suit":"spades","name":"K","returned":false},{"suit":"diams","name":"Q","returned":false}],[{"suit":"hearts","name":"A","returned":true},{"suit":"clubs","name":"5","returned":false}],[{"suit":"hearts","name":"K","returned":true},{"suit":"spades","name":"Q","returned":false}],[{"suit":"diams","name":"9","returned":true},{"suit":"hearts","name":"6","returned":true},{"suit":"clubs","name":"K","returned":true},{"suit":"hearts","name":"3","returned":false},{"suit":"spades","name":"2","returned":false}],[{"suit":"diams","name":"6","returned":true},{"suit":"clubs","name":"A","returned":true},{"suit":"diams","name":"8","returned":true},{"suit":"spades","name":"3","returned":false},{"suit":"diams","name":"2","returned":false}],[{"suit":"diams","name":"A","returned":true},{"suit":"spades","name":"7","returned":true},{"suit":"hearts","name":"10","returned":true},{"suit":"clubs","name":"7","returned":true},{"suit":"diams","name":"5","returned":true},{"suit":"diams","name":"10","returned":false}],[{"suit":"diams","name":"3","returned":true},{"suit":"hearts","name":"7","returned":true},{"suit":"hearts","name":"Q","returned":true},{"suit":"clubs","name":"9","returned":true},{"suit":"spades","name":"4","returned":true},{"suit":"spades","name":"10","returned":false}]],"stub":{"cards":[{"suit":"clubs","name":"3"},{"suit":"spades","name":"6"},{"suit":"clubs","name":"10"},{"suit":"spades","name":"9"},{"suit":"diams","name":"7"},{"suit":"clubs","name":"J"},{"suit":"clubs","name":"2"},{"suit":"diams","name":"4"},{"suit":"hearts","name":"9"},{"suit":"clubs","name":"6"},{"suit":"clubs","name":"Q"},{"suit":"hearts","name":"5"},{"suit":"spades","name":"5"},{"suit":"spades","name":"J"},{"suit":"spades","name":"A"},{"suit":"hearts","name":"8"},{"suit":"clubs","name":"8"},{"suit":"spades","name":"8"},{"suit":"clubs","name":"4"},{"suit":"hearts","name":"J"},{"suit":"diams","name":"J"},{"suit":"hearts","name":"2"},{"suit":"diams","name":"K"},{"suit":"hearts","name":"4"}],"returnedCards":[]}}');
  //   // let cheatedGame = JSON.parse('{"kingSlots":[[{"suit":"hearts","name":"A"},{"suit":"hearts","name":"2"},{"suit":"hearts","name":"3"},{"suit":"hearts","name":"4"},{"suit":"hearts","name":"5"},{"suit":"hearts","name":"6"},{"suit":"hearts","name":"7"},{"suit":"hearts","name":"8"},{"suit":"hearts","name":"9"},{"suit":"hearts","name":"10"},{"suit":"hearts","name":"J"},{"suit":"hearts","name":"Q"},{"suit":"hearts","name":"K"}],[{"suit":"spades","name":"A"},{"suit":"spades","name":"2"},{"suit":"spades","name":"3"},{"suit":"spades","name":"4"},{"suit":"spades","name":"5"},{"suit":"spades","name":"6"},{"suit":"spades","name":"7"},{"suit":"spades","name":"8"},{"suit":"spades","name":"9"},{"suit":"spades","name":"10"},{"suit":"spades","name":"J"},{"suit":"spades","name":"Q"},{"suit":"spades","name":"K"}],[{"suit":"diams","name":"A"},{"suit":"diams","name":"2"},{"suit":"diams","name":"3"},{"suit":"diams","name":"4"},{"suit":"diams","name":"5"},{"suit":"diams","name":"6"},{"suit":"diams","name":"7"},{"suit":"diams","name":"8"},{"suit":"diams","name":"9"},{"suit":"diams","name":"10"}],[{"suit":"clubs","name":"A"},{"suit":"clubs","name":"2"},{"suit":"clubs","name":"3"},{"suit":"clubs","name":"4"},{"suit":"clubs","name":"5"},{"suit":"clubs","name":"6"},{"suit":"clubs","name":"7"},{"suit":"clubs","name":"8"},{"suit":"clubs","name":"9"},{"suit":"clubs","name":"10"},{"suit":"clubs","name":"J"},{"suit":"clubs","name":"Q"},{"suit":"clubs","name":"K"}]],"slots":[[{"suit":"diams","name":"K","returned":false}],[],[],[],[],[],[],[]],"stub":{"cards":[{"suit":"diams","name":"J"}],"returnedCards":[{"suit":"diams","name":"Q","returned":true}]}}');
  //   this.restore(testGame2);
  // }

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
        this.canAutoSolve();
        this.isNotFinished = this.isGameNotFinished();//checks if game is over
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

  canAutoSolve() {
    if (this.stub.cards.length === 0 && this.stub.returnedCards.length === 0 && this.slots.every((s) => s.cards.every(c => !c.returned))) {
      this.autoSolve = true;
    } else {
      this.autoSolve = false;
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
    let beforeState = this.dump();
    this.moves.push(beforeState);
    this.stub.turn();
  }

  fullyTurnStub() {
    this.stub.returnedCards.forEach(c => this.returnCard(c));
  }

  getSlot(slotIndex, zone) {
    if (zone === ZONES.slots) {
      return this.slots[slotIndex];
    } else if (zone === ZONES.kingSlots) {
      return this.kingSlots[0];
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
}
