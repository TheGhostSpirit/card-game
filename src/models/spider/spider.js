import {
  inject
} from 'aurelia-framework';
import {
  SpiderDeck
} from './spider-deck';
import {
  Foundation
} from './foundation';
import {
  SpiderStub
} from './spider-stub';
import {
  SpiderSlot
} from './spider-slot';

@inject(SpiderDeck)
export class Spider {

  constructor(spiderDeck) {
    this.deck = spiderDeck;
    this.logger = console;
  }

  newGame() {
    this.initialize();
    this.deck.initialize();
    this.distributeFromDeck(this.deck);
  }

  initialize() {
    this.isNotFinished = true;
    this.previousSelection = undefined;
    this.foundation = new Foundation();
    this.stub = new SpiderStub();
    this.moves = [];
    this.slots = [];
    for (let i = 0; i < 10; i++) {
      this.slots.push(new SpiderSlot(i));
    }
  }

  cheat() {
    this.initialize();
    let game = JSON.parse('{"foundation":[],"slots":[[{"suit":"spades","name":"6","returned":true},{"suit":"spades","name":"6","returned":true},{"suit":"hearts","name":"K","returned":false},{"suit":"hearts","name":"5","returned":false},{"suit":"hearts","name":"4","returned":false},{"suit":"hearts","name":"3","returned":false},{"suit":"spades","name":"J","returned":false}],[{"suit":"hearts","name":"10","returned":false},{"suit":"spades","name":"9","returned":false}],[{"suit":"spades","name":"6","returned":false},{"suit":"spades","name":"5","returned":false},{"suit":"spades","name":"4","returned":false},{"suit":"spades","name":"3","returned":false},{"suit":"spades","name":"2","returned":false},{"suit":"spades","name":"A","returned":false},{"suit":"spades","name":"6","returned":false},{"suit":"spades","name":"5","returned":false}],[{"suit":"spades","name":"Q","returned":true},{"suit":"hearts","name":"8","returned":false},{"suit":"spades","name":"7","returned":false},{"suit":"hearts","name":"6","returned":false},{"suit":"hearts","name":"5","returned":false},{"suit":"hearts","name":"7","returned":false}],[{"suit":"spades","name":"Q","returned":true},{"suit":"hearts","name":"9","returned":true},{"suit":"spades","name":"3","returned":true},{"suit":"hearts","name":"K","returned":false},{"suit":"spades","name":"Q","returned":false},{"suit":"spades","name":"J","returned":false},{"suit":"spades","name":"10","returned":false},{"suit":"spades","name":"9","returned":false},{"suit":"spades","name":"K","returned":false}],[{"suit":"spades","name":"9","returned":true},{"suit":"hearts","name":"A","returned":true},{"suit":"hearts","name":"2","returned":true},{"suit":"spades","name":"5","returned":true},{"suit":"spades","name":"8","returned":false},{"suit":"spades","name":"7","returned":false},{"suit":"hearts","name":"6","returned":false},{"suit":"spades","name":"5","returned":false},{"suit":"spades","name":"K","returned":false},{"suit":"spades","name":"2","returned":false}],[{"suit":"hearts","name":"8","returned":false},{"suit":"hearts","name":"7","returned":false},{"suit":"hearts","name":"6","returned":false},{"suit":"hearts","name":"5","returned":false},{"suit":"hearts","name":"4","returned":false},{"suit":"hearts","name":"3","returned":false},{"suit":"hearts","name":"2","returned":false},{"suit":"hearts","name":"A","returned":false},{"suit":"hearts","name":"9","returned":false}],[{"suit":"spades","name":"10","returned":true},{"suit":"hearts","name":"Q","returned":true},{"suit":"hearts","name":"K","returned":false},{"suit":"hearts","name":"Q","returned":false},{"suit":"spades","name":"J","returned":false},{"suit":"hearts","name":"10","returned":false},{"suit":"spades","name":"7","returned":false}],[{"suit":"spades","name":"10","returned":true},{"suit":"spades","name":"4","returned":true},{"suit":"spades","name":"3","returned":true},{"suit":"spades","name":"4","returned":true},{"suit":"hearts","name":"4","returned":false},{"suit":"hearts","name":"3","returned":false},{"suit":"hearts","name":"2","returned":false},{"suit":"hearts","name":"A","returned":false},{"suit":"hearts","name":"K","returned":false},{"suit":"hearts","name":"Q","returned":false},{"suit":"hearts","name":"J","returned":false},{"suit":"hearts","name":"10","returned":false}],[{"suit":"spades","name":"3","returned":false},{"suit":"spades","name":"2","returned":false},{"suit":"spades","name":"A","returned":false},{"suit":"hearts","name":"Q","returned":false}]],"stub":{"cards":[{"suit":"hearts","name":"J","returned":true},{"suit":"spades","name":"K","returned":true},{"suit":"hearts","name":"7","returned":true},{"suit":"spades","name":"7","returned":true},{"suit":"hearts","name":"8","returned":true},{"suit":"hearts","name":"9","returned":true},{"suit":"spades","name":"8","returned":true},{"suit":"hearts","name":"10","returned":true},{"suit":"hearts","name":"2","returned":true},{"suit":"hearts","name":"6","returned":true},{"suit":"spades","name":"8","returned":true},{"suit":"spades","name":"4","returned":true},{"suit":"spades","name":"A","returned":true},{"suit":"hearts","name":"5","returned":true},{"suit":"spades","name":"10","returned":true},{"suit":"hearts","name":"7","returned":true},{"suit":"spades","name":"8","returned":true},{"suit":"hearts","name":"3","returned":true},{"suit":"hearts","name":"6","returned":true},{"suit":"hearts","name":"A","returned":true},{"suit":"hearts","name":"J","returned":true},{"suit":"spades","name":"A","returned":true},{"suit":"hearts","name":"9","returned":true},{"suit":"hearts","name":"J","returned":true},{"suit":"spades","name":"J","returned":true},{"suit":"spades","name":"K","returned":true},{"suit":"spades","name":"2","returned":true},{"suit":"spades","name":"Q","returned":true},{"suit":"hearts","name":"8","returned":true},{"suit":"spades","name":"9","returned":true}]}}');
    this.restore(game);
  }

  logJson() {
    this.logger.log(JSON.stringify(this.dump()));
  }

  dump() {
    return {
      foundation: this.foundation.dump(),
      slots: this.slots.map(s => s.dump()),
      stub: this.stub.dump()
    };
  }

  restore(savedGame) {
    let game = savedGame;
    this.foundation.load(game.foundation);
    this.slots.forEach((s, index) => s.load(game.slots[index]));
    this.stub.load(game.stub);
  }

  distributeFromDeck(deck) {
    deck.shuffle();
    for (let i = 0; i < 10; i++) {
      this.slots[i].fill(deck, i);
    }
    this.stub.fill(deck);
  }

  callStub() {
    if (this.stub.cards.length > 0) {
      this.slots.forEach(slot => slot.unselect());
      this.previousSelection = undefined;
      this.moves.push(this.dump());
      for (let i = 0; i < 10; i++) {
        this.slots[i].cards.push(this.stub.getLastCard());
      }
    }
  }

  setSelectedCardIndex(cardIndex) {
    this.selectedCardIndex = cardIndex;
  }

  moveCard(cardIndex, slotIndex) {
    if (cardIndex === -1) cardIndex = this.selectedCardIndex;
    if (typeof this.previousSelection !== 'undefined') {
      let destinationSlot = this.slots[slotIndex];
      let src = this.getCards(this.previousSelection);
      this.unselectCards(this.previousSelection);
      if (destinationSlot.canMoveTo(src)) {
        this.doMove(this.previousSelection.slot.cards, destinationSlot.cards, src);
        this.isNotFinished = this.isGameNotFinished();
      }
      this.previousSelection = undefined;
    } else {
      let sourceSlot = this.slots[slotIndex];
      if (sourceSlot.canGetFrom(cardIndex)) {
        this.previousSelection = {
          slot: sourceSlot,
          index: cardIndex
        };
        this.selectCards(this.previousSelection);
      }
    }
  }

  doMove(source, destination, selection) {
    let beforeState = this.dump();
    this.moves.push(beforeState);
    selection.forEach((c, i) => {
      source.splice(source.findIndex((sc, si) => sc.isEqual(c) && i === si), 1);
      destination.push(c);
    });
    this.returnNextCardInSlot(source);
    this.hasMadeAPile(destination);
  }

  undoMove() {
    if (this.moves.length > 0) {
      this.restore(this.moves.pop());
    }
  }

  hasMadeAPile(destination) {
    while (destination.findIndex(c => c.value === 13) !== -1) {
      let index = destination.findIndex(c => c.value === 13);
      if (index + 12 > destination.length - 1) return;
      for (let i = 0; i < 12; i++) {
        if (destination[index + i].value - 1 !== destination[index + i + 1].value || !destination[index + i].isSameSuit(destination[index + i + 1])) return;
      }
      let suit = destination.slice(index, index + 13);
      destination.splice(index, 13);
      for (let i = 0; i < 13; i++) {
        this.foundation.cards.push(suit.pop());
      }
    }
  }

  returnNextCardInSlot(source) {
    if (source.length > 0 && typeof source.find(c => !c.returned) === 'undefined') {
      this.returnCard(source[source.length - 1]);
    }
  }

  isGameNotFinished() {
    return !this.foundation.isFull();
  }

  getCards(cardsSelection) {
    return cardsSelection.slot.cards.filter((c, i) => i >= cardsSelection.index);
  }

  selectCards(cardsSelection) {
    this.getCards(cardsSelection).forEach(card => this.selectCard(card));
  }

  unselectCards(cardsSelection) {
    this.getCards(cardsSelection).forEach(card => this.selectCard(card));
  }

  selectCard(card) {
    card.selected = !card.selected;
  }

  returnCard(card) {
    card.returned = !card.returned;
  }
}
