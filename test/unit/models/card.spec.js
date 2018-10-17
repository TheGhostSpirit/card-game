import { Card } from '../../../src/models/card/card';

describe('card', () => {
  it('should be equal', () => {
    let card1 = new Card('hearts', 'A');
    let card2 = new Card('hearts', 'A');
    expect(card1.isEqual(card2)).toBe(true);
  });

  it('should not be equal', () => {
    let card1 = new Card('hearts', 'A');
    let card2 = new Card('hearts', 'K');
    expect(card1.isEqual(card2)).toBe(false);
  });

  it('should not be equal', () => {
    let card1 = new Card('hearts', 'A');
    let card2 = new Card('spades', 'A');
    expect(card1.isEqual(card2)).toBe(false);
  });

  it('should not be equal', () => {
    let card1 = new Card('hearts', 'A');
    let card2 = new Card('diams', 'Q');
    expect(card1.isEqual(card2)).toBe(false);
  });
});
