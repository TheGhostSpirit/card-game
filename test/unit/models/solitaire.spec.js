import { Solitaire } from '../../../src/models/solitaire/solitaire';
import { Deck } from '../../../src/models/solitaire/deck';
import { Card } from '../../../src/models/card/card';
import { ZONES } from '../../../src/models/solitaire/solitaire-const';


describe('solitaire doMove & undoMove from stub to kingSlot', () => {
  let systemUnderTest;

  beforeEach(() => {
    systemUnderTest = new Solitaire(new Deck());
    systemUnderTest.initialize();
    let startGame = JSON.parse('{"kingSlots":[[{"suit":"hearts","name":"A"},{"suit":"hearts","name":"2"},{"suit":"hearts","name":"3"},{"suit":"hearts","name":"4"},{"suit":"hearts","name":"5"},{"suit":"hearts","name":"6"},{"suit":"hearts","name":"7"},{"suit":"hearts","name":"8"},{"suit":"hearts","name":"9"},{"suit":"hearts","name":"10"},{"suit":"hearts","name":"J"},{"suit":"hearts","name":"Q"},{"suit":"hearts","name":"K"}],[{"suit":"spades","name":"A"},{"suit":"spades","name":"2"},{"suit":"spades","name":"3"},{"suit":"spades","name":"4"},{"suit":"spades","name":"5"},{"suit":"spades","name":"6"},{"suit":"spades","name":"7"},{"suit":"spades","name":"8"},{"suit":"spades","name":"9"},{"suit":"spades","name":"10"},{"suit":"spades","name":"J"},{"suit":"spades","name":"Q"},{"suit":"spades","name":"K"}],[{"suit":"diams","name":"A"},{"suit":"diams","name":"2"},{"suit":"diams","name":"3"},{"suit":"diams","name":"4"},{"suit":"diams","name":"5"},{"suit":"diams","name":"6"},{"suit":"diams","name":"7"},{"suit":"diams","name":"8"},{"suit":"diams","name":"9"},{"suit":"diams","name":"10"}],[{"suit":"clubs","name":"A"},{"suit":"clubs","name":"2"},{"suit":"clubs","name":"3"},{"suit":"clubs","name":"4"},{"suit":"clubs","name":"5"},{"suit":"clubs","name":"6"},{"suit":"clubs","name":"7"},{"suit":"clubs","name":"8"},{"suit":"clubs","name":"9"},{"suit":"clubs","name":"10"},{"suit":"clubs","name":"J"},{"suit":"clubs","name":"Q"},{"suit":"clubs","name":"K"}]],"slots":[[{"suit":"diams","name":"K","returned":false}],[],[],[],[],[],[],[]],"stub":{"cards":[{"suit":"diams","name":"J"}],"returnedCards":[{"suit":"diams","name":"Q","returned":true}]}}');
    systemUnderTest.restore(startGame);
    let move = { source: systemUnderTest.stub.cards, destination: systemUnderTest.kingSlots[2].cards, selection: [systemUnderTest.stub.cards[systemUnderTest.stub.cards.length - 1]], zone: 'stub' };
    systemUnderTest.doMove(move.source, move.destination, move.selection, move.zone);
  });

  it('3rd KS should contain diams J', () => {
    expect(systemUnderTest.kingSlots[2].cards.some(c => c.isEqual(new Card('diams', 'J')))).toBe(true);
  });

  it('Stub should not contain diams J', () => {
    expect(systemUnderTest.stub.cards.some(c => c.isEqual(new Card('diams', 'J')))).toBe(false);
  });

  it('3rd KS should no longer contain diams J', () => {
    systemUnderTest.undoMove();
    expect(systemUnderTest.kingSlots[2].cards.some(c => c.isEqual(new Card('diams', 'J')))).toBe(false);
  });

  it('Stub should now contain diams J', () => {
    systemUnderTest.undoMove();
    expect(systemUnderTest.stub.cards.some(c => c.isEqual(new Card('diams', 'J')))).toBe(true);
  });
});

describe('solitaire doMove & undoMove from stub to Slot', () => {
  let systemUnderTest;

  beforeEach(() => {
    systemUnderTest = new Solitaire(new Deck());
    systemUnderTest.initialize();
    let startGame = JSON.parse('{"kingSlots":[[],[],[],[]],"slots":[[{"suit":"spades","name":"K","returned":false},{"suit":"diams","name":"Q","returned":false}],[{"suit":"hearts","name":"A","returned":true},{"suit":"clubs","name":"5","returned":false}],[{"suit":"hearts","name":"K","returned":true},{"suit":"spades","name":"Q","returned":false}],[{"suit":"diams","name":"9","returned":true},{"suit":"hearts","name":"6","returned":true},{"suit":"clubs","name":"K","returned":true},{"suit":"hearts","name":"3","returned":false},{"suit":"spades","name":"2","returned":false}],[{"suit":"diams","name":"6","returned":true},{"suit":"clubs","name":"A","returned":true},{"suit":"diams","name":"8","returned":true},{"suit":"spades","name":"3","returned":false},{"suit":"diams","name":"2","returned":false}],[{"suit":"diams","name":"A","returned":true},{"suit":"spades","name":"7","returned":true},{"suit":"hearts","name":"10","returned":true},{"suit":"clubs","name":"7","returned":true},{"suit":"diams","name":"5","returned":true},{"suit":"diams","name":"10","returned":false}],[{"suit":"diams","name":"3","returned":true},{"suit":"hearts","name":"7","returned":true},{"suit":"hearts","name":"Q","returned":true},{"suit":"clubs","name":"9","returned":true},{"suit":"spades","name":"4","returned":true},{"suit":"spades","name":"10","returned":false}]],"stub":{"cards":[{"suit":"clubs","name":"3"},{"suit":"spades","name":"6"},{"suit":"clubs","name":"10"},{"suit":"spades","name":"9"},{"suit":"diams","name":"7"},{"suit":"clubs","name":"J"},{"suit":"clubs","name":"2"},{"suit":"diams","name":"4"},{"suit":"hearts","name":"9"},{"suit":"clubs","name":"6"},{"suit":"clubs","name":"Q"},{"suit":"hearts","name":"5"},{"suit":"spades","name":"5"},{"suit":"spades","name":"J"},{"suit":"spades","name":"A"},{"suit":"hearts","name":"8"},{"suit":"clubs","name":"8"},{"suit":"spades","name":"8"},{"suit":"clubs","name":"4"},{"suit":"hearts","name":"J"},{"suit":"diams","name":"J"},{"suit":"hearts","name":"2"},{"suit":"diams","name":"K"},{"suit":"hearts","name":"4"}],"returnedCards":[]}}');
    systemUnderTest.restore(startGame);
    let move = { source: systemUnderTest.stub.cards, destination: systemUnderTest.slots[0].cards, selection: systemUnderTest.stub.cards.filter(c => c.isEqual(new Card('clubs', 'J'))), zone: 'stub' };
    systemUnderTest.doMove(move.source, move.destination, move.selection, move.zone);
  });

  it('1st S should contain club J', () => {
    expect(systemUnderTest.slots[0].cards.some(c => c.isEqual(new Card('clubs', 'J')))).toBe(true);
  });

  it('Stub should not contain club J', () => {
    expect(systemUnderTest.stub.cards.some(c => c.isEqual(new Card('clubs', 'J')))).toBe(false);
  });

  it('1st S should no longer contain club J', () => {
    systemUnderTest.undoMove();
    expect(systemUnderTest.slots[0].cards.some(c => c.isEqual(new Card('clubs', 'J')))).toBe(false);
  });

  it('Stub should now contain club J', () => {
    systemUnderTest.undoMove();
    expect(systemUnderTest.stub.cards.some(c => c.isEqual(new Card('clubs', 'J')))).toBe(true);
  });
});

describe('solitaire doMove & undoMove from Slot to Slot', () => {
  let systemUnderTest;

  beforeEach(() => {
    systemUnderTest = new Solitaire(new Deck());
    systemUnderTest.initialize();
    let startGame = JSON.parse('{"kingSlots":[[],[],[],[]],"slots":[[{"suit":"clubs","name":"K","returned":false}],[{"suit":"hearts","name":"4","returned":true},{"suit":"clubs","name":"2","returned":false}],[{"suit":"diams","name":"8","returned":true},{"suit":"diams","name":"Q","returned":true},{"suit":"clubs","name":"9","returned":false}],[{"suit":"hearts","name":"2","returned":true},{"suit":"diams","name":"J","returned":true},{"suit":"spades","name":"9","returned":true},{"suit":"diams","name":"10","returned":false}],[{"suit":"spades","name":"7","returned":true},{"suit":"diams","name":"5","returned":true},{"suit":"diams","name":"6","returned":true},{"suit":"diams","name":"A","returned":true},{"suit":"spades","name":"Q","returned":false}],[{"suit":"clubs","name":"8","returned":true},{"suit":"diams","name":"K","returned":true},{"suit":"diams","name":"7","returned":true},{"suit":"hearts","name":"A","returned":true},{"suit":"diams","name":"4","returned":true},{"suit":"spades","name":"A","returned":false}],[{"suit":"clubs","name":"10","returned":true},{"suit":"hearts","name":"5","returned":true},{"suit":"hearts","name":"K","returned":true},{"suit":"clubs","name":"4","returned":true},{"suit":"spades","name":"K","returned":true},{"suit":"diams","name":"3","returned":true},{"suit":"clubs","name":"5","returned":false}]],"stub":{"cards":[],"returnedCards":[{"suit":"hearts","name":"6","returned":true},{"suit":"diams","name":"9","returned":true},{"suit":"diams","name":"2","returned":true},{"suit":"spades","name":"6","returned":true},{"suit":"hearts","name":"Q","returned":true},{"suit":"clubs","name":"7","returned":true},{"suit":"spades","name":"8","returned":true},{"suit":"hearts","name":"7","returned":true},{"suit":"spades","name":"J","returned":true},{"suit":"clubs","name":"6","returned":true},{"suit":"spades","name":"10","returned":true},{"suit":"clubs","name":"J","returned":true},{"suit":"hearts","name":"J","returned":true},{"suit":"hearts","name":"10","returned":true},{"suit":"clubs","name":"Q","returned":true},{"suit":"spades","name":"3","returned":true},{"suit":"spades","name":"5","returned":true},{"suit":"spades","name":"4","returned":true},{"suit":"hearts","name":"3","returned":true},{"suit":"clubs","name":"A","returned":true},{"suit":"hearts","name":"9","returned":true},{"suit":"hearts","name":"8","returned":true},{"suit":"spades","name":"2","returned":true},{"suit":"clubs","name":"3","returned":true}]}}');
    systemUnderTest.restore(startGame);
    let move = { source: systemUnderTest.slots[2].cards, destination: systemUnderTest.slots[3].cards, selection: systemUnderTest.slots[2].cards.filter(c => c.isEqual(new Card('clubs', '9'))), zone: ZONES.slots };
    systemUnderTest.doMove(move.source, move.destination, move.selection, move.zone);
  });

  it('4th S should contain club 9', () => {
    expect(systemUnderTest.slots[3].cards.some(c => c.isEqual(new Card('clubs', '9')))).toBe(true);
  });

  it('3rd S should not contain club 9', () => {
    expect(systemUnderTest.slots[2].cards.some(c => c.isEqual(new Card('clubs', '9')))).toBe(false);
  });

  it('should return last 3rds slot card', () => {
    expect(systemUnderTest.slots[2].cards[systemUnderTest.slots[2].cards.length - 1].returned).toBe(false);
  });

  it('4th S should no longer contain club 9', () => {
    systemUnderTest.undoMove();
    expect(systemUnderTest.slots[3].cards.some(c => c.isEqual(new Card('clubs', '9')))).toBe(false);
  });

  it('3rd S should now contain club 9', () => {
    systemUnderTest.undoMove();
    expect(systemUnderTest.slots[2].cards.some(c => c.isEqual(new Card('clubs', '9')))).toBe(true);
  });

  it('should return last 3rds slot card', () => {
    expect(systemUnderTest.slots[2].cards[systemUnderTest.slots[2].cards.length - 2].returned).toBe(true);
  });
});

describe('solitaire doMove & undoMove from Slot to KingSlot', () => {
  let systemUnderTest;

  beforeEach(() => {
    systemUnderTest = new Solitaire(new Deck());
    systemUnderTest.initialize();
    let startGame = JSON.parse('{"kingSlots":[[],[],[],[]],"slots":[[{"suit":"clubs","name":"J","returned":false}],[{"suit":"hearts","name":"8","returned":true},{"suit":"hearts","name":"3","returned":false}],[{"suit":"spades","name":"K","returned":true},{"suit":"diams","name":"4","returned":true},{"suit":"clubs","name":"2","returned":false}],[{"suit":"clubs","name":"6","returned":true},{"suit":"diams","name":"9","returned":true},{"suit":"clubs","name":"Q","returned":true},{"suit":"spades","name":"A","returned":false}],[{"suit":"diams","name":"5","returned":true},{"suit":"clubs","name":"10","returned":true},{"suit":"diams","name":"6","returned":true},{"suit":"hearts","name":"10","returned":true},{"suit":"clubs","name":"9","returned":false}],[{"suit":"hearts","name":"A","returned":true},{"suit":"diams","name":"J","returned":true},{"suit":"diams","name":"10","returned":true},{"suit":"spades","name":"7","returned":true},{"suit":"hearts","name":"J","returned":true},{"suit":"clubs","name":"A","returned":false}],[{"suit":"hearts","name":"K","returned":true},{"suit":"spades","name":"6","returned":true},{"suit":"clubs","name":"7","returned":true},{"suit":"clubs","name":"8","returned":true},{"suit":"hearts","name":"2","returned":true},{"suit":"diams","name":"8","returned":true},{"suit":"spades","name":"3","returned":false}]],"stub":{"cards":[],"returnedCards":[{"suit":"diams","name":"3","returned":true},{"suit":"spades","name":"9","returned":true},{"suit":"spades","name":"2","returned":true},{"suit":"spades","name":"8","returned":true},{"suit":"spades","name":"5","returned":true},{"suit":"diams","name":"K","returned":true},{"suit":"hearts","name":"Q","returned":true},{"suit":"clubs","name":"3","returned":true},{"suit":"clubs","name":"5","returned":true},{"suit":"diams","name":"7","returned":true},{"suit":"diams","name":"A","returned":true},{"suit":"hearts","name":"9","returned":true},{"suit":"diams","name":"Q","returned":true},{"suit":"hearts","name":"6","returned":true},{"suit":"hearts","name":"5","returned":true},{"suit":"clubs","name":"4","returned":true},{"suit":"spades","name":"J","returned":true},{"suit":"hearts","name":"7","returned":true},{"suit":"spades","name":"10","returned":true},{"suit":"spades","name":"4","returned":true},{"suit":"clubs","name":"K","returned":true},{"suit":"spades","name":"Q","returned":true},{"suit":"hearts","name":"4","returned":true},{"suit":"diams","name":"2","returned":true}]}}');
    systemUnderTest.restore(startGame);
    let move = { source: systemUnderTest.slots[3].cards, destination: systemUnderTest.kingSlots[1].cards, selection: systemUnderTest.slots[3].cards.filter(c => c.isEqual(new Card('spades', 'A'))), zone: ZONES.slots };
    systemUnderTest.doMove(move.source, move.destination, move.selection, move.zone);
  });

  it('2nd KS should contain spade A', () => {
    expect(systemUnderTest.kingSlots[1].cards.some(c => c.isEqual(new Card('spades', 'A')))).toBe(true);
  });

  it('3rd S should not contain spade A', () => {
    expect(systemUnderTest.slots[3].cards.some(c => c.isEqual(new Card('spades', 'A')))).toBe(false);
  });

  it('should return last 4th slot card', () => {
    expect(systemUnderTest.slots[3].cards[systemUnderTest.slots[3].cards.length - 1].returned).toBe(false);
  });

  it('2nd KS should no longer contain spade A', () => {
    systemUnderTest.undoMove();
    expect(systemUnderTest.kingSlots[1].cards.some(c => c.isEqual(new Card('spades', 'A')))).toBe(false);
  });

  it('3rd S should now contain spade A', () => {
    systemUnderTest.undoMove();
    expect(systemUnderTest.slots[3].cards.some(c => c.isEqual(new Card('spades', 'A')))).toBe(true);
  });

  it('should return last 4th slot card', () => {
    expect(systemUnderTest.slots[3].cards[systemUnderTest.slots[3].cards.length - 2].returned).toBe(true);
  });
});
