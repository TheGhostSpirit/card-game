import { Deck } from '../../../src/models/deck';

describe('deck', () => {
  let systemUnderTest;

  beforeEach(() => {
    systemUnderTest = new Deck();
  });

  it('should contain 52 cards', () => {
    expect(systemUnderTest.cards.length).toBe(52);
  });

  it('should contain 4 colors', () => {
    expect(systemUnderTest.cards.filter(c => c.suit !== 'hearts' && c.suit !== 'spades' && c.suit !== 'diams' && c.suit !== 'clubs').length).toBe(0);
  });

  it('should not contain clones', () => {
    expect(systemUnderTest.cards.filter((c, i) => systemUnderTest.cards.find((ca, ci) => ca.isEqual(c) && i !== ci)).length).toBe(0);
  });
});
