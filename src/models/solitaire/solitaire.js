import {
  inject
} from 'aurelia-framework';
import {
  Deck
} from './deck';
import {
  Stub
} from './stub';
import {
  KingSlot
} from './king-slot';
import {
  Slot
} from './slot';
import {
  SUITS,
  ZONES
} from './solitaire-const';

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
   * Creates a cheated game.
   */
  cheat() {
    let game = JSON.parse('{"kingSlots":[[{"suit":"hearts","name":"A"},{"suit":"hearts","name":"2"},{"suit":"hearts","name":"3"},{"suit":"hearts","name":"4"},{"suit":"hearts","name":"5"},{"suit":"hearts","name":"6"},{"suit":"hearts","name":"7"},{"suit":"hearts","name":"8"},{"suit":"hearts","name":"9"},{"suit":"hearts","name":"10"},{"suit":"hearts","name":"J"},{"suit":"hearts","name":"Q"},{"suit":"hearts","name":"K"}],[{"suit":"spades","name":"A"},{"suit":"spades","name":"2"},{"suit":"spades","name":"3"},{"suit":"spades","name":"4"},{"suit":"spades","name":"5"},{"suit":"spades","name":"6"},{"suit":"spades","name":"7"},{"suit":"spades","name":"8"},{"suit":"spades","name":"9"},{"suit":"spades","name":"10"},{"suit":"spades","name":"J"},{"suit":"spades","name":"Q"},{"suit":"spades","name":"K"}],[{"suit":"diams","name":"A"},{"suit":"diams","name":"2"},{"suit":"diams","name":"3"},{"suit":"diams","name":"4"},{"suit":"diams","name":"5"},{"suit":"diams","name":"6"},{"suit":"diams","name":"7"},{"suit":"diams","name":"8"},{"suit":"diams","name":"9"},{"suit":"diams","name":"10"}],[{"suit":"clubs","name":"A"},{"suit":"clubs","name":"2"},{"suit":"clubs","name":"3"},{"suit":"clubs","name":"4"},{"suit":"clubs","name":"5"},{"suit":"clubs","name":"6"},{"suit":"clubs","name":"7"},{"suit":"clubs","name":"8"},{"suit":"clubs","name":"9"},{"suit":"clubs","name":"10"},{"suit":"clubs","name":"J"},{"suit":"clubs","name":"Q"},{"suit":"clubs","name":"K"}]],"slots":[[{"suit":"diams","name":"K","returned":false}],[],[],[],[],[],[],[]],"stub":{"cards":[{"suit":"diams","name":"J"}],"returnedCards":[{"suit":"diams","name":"Q","returned":true}]}}');
    this.loadGame(game);
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
}
