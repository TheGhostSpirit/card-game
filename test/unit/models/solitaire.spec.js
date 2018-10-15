import { Solitaire } from '../../../src/models/solitaire';
import { Deck } from '../../../src/models/deck';

describe('solitaire', () => {
  let systemUnderTest;

  beforeEach(()=>{
    systemUnderTest = new Solitaire(new Deck(), {});
    systemUnderTest.initialize();
  });

  it('moves case 1', () => {
    let startGame = JSON.parse('{"game":{"kingSlots":[[{"suit":"hearts","name":"A"},{"suit":"hearts","name":"2"},{"suit":"hearts","name":"3"},{"suit":"hearts","name":"4"},{"suit":"hearts","name":"5"},{"suit":"hearts","name":"6"},{"suit":"hearts","name":"7"},{"suit":"hearts","name":"8"},{"suit":"hearts","name":"9"},{"suit":"hearts","name":"10"},{"suit":"hearts","name":"J"},{"suit":"hearts","name":"Q"},{"suit":"hearts","name":"K"}],[{"suit":"spades","name":"A"},{"suit":"spades","name":"2"},{"suit":"spades","name":"3"},{"suit":"spades","name":"4"},{"suit":"spades","name":"5"},{"suit":"spades","name":"6"},{"suit":"spades","name":"7"},{"suit":"spades","name":"8"},{"suit":"spades","name":"9"},{"suit":"spades","name":"10"},{"suit":"spades","name":"J"},{"suit":"spades","name":"Q"},{"suit":"spades","name":"K"}],[{"suit":"clubs","name":"A"},{"suit":"clubs","name":"2"},{"suit":"clubs","name":"3"},{"suit":"clubs","name":"4"},{"suit":"clubs","name":"5"},{"suit":"clubs","name":"6"},{"suit":"clubs","name":"7"},{"suit":"clubs","name":"8"},{"suit":"clubs","name":"9"},{"suit":"clubs","name":"10"},{"suit":"clubs","name":"J"},{"suit":"clubs","name":"Q"},{"suit":"clubs","name":"K"}],[{"suit":"diams","name":"A"},{"suit":"diams","name":"2"},{"suit":"diams","name":"3"},{"suit":"diams","name":"4"},{"suit":"diams","name":"5"},{"suit":"diams","name":"6"},{"suit":"diams","name":"7"},{"suit":"diams","name":"8"},{"suit":"diams","name":"9"},{"suit":"diams","name":"10"}]],"stub":{"cards":[{"suit":"diams","name":"J"}],"returnedCards":[{"suit":"diams","name":"Q","returned":true}]},"slots":[[{"suit":"diams","name":"K"}],[],[],[],[],[],[]]}}');
    let endGameDump = '{"kingSlots":[[{"suit":"hearts","name":"A"},{"suit":"hearts","name":"2"},{"suit":"hearts","name":"3"},{"suit":"hearts","name":"4"},{"suit":"hearts","name":"5"},{"suit":"hearts","name":"6"},{"suit":"hearts","name":"7"},{"suit":"hearts","name":"8"},{"suit":"hearts","name":"9"},{"suit":"hearts","name":"10"},{"suit":"hearts","name":"J"},{"suit":"hearts","name":"Q"},{"suit":"hearts","name":"K"}],[{"suit":"spades","name":"A"},{"suit":"spades","name":"2"},{"suit":"spades","name":"3"},{"suit":"spades","name":"4"},{"suit":"spades","name":"5"},{"suit":"spades","name":"6"},{"suit":"spades","name":"7"},{"suit":"spades","name":"8"},{"suit":"spades","name":"9"},{"suit":"spades","name":"10"},{"suit":"spades","name":"J"},{"suit":"spades","name":"Q"},{"suit":"spades","name":"K"}],[{"suit":"clubs","name":"A"},{"suit":"clubs","name":"2"},{"suit":"clubs","name":"3"},{"suit":"clubs","name":"4"},{"suit":"clubs","name":"5"},{"suit":"clubs","name":"6"},{"suit":"clubs","name":"7"},{"suit":"clubs","name":"8"},{"suit":"clubs","name":"9"},{"suit":"clubs","name":"10"},{"suit":"clubs","name":"J"},{"suit":"clubs","name":"Q"},{"suit":"clubs","name":"K"}],[{"suit":"diams","name":"A"},{"suit":"diams","name":"2"},{"suit":"diams","name":"3"},{"suit":"diams","name":"4"},{"suit":"diams","name":"5"},{"suit":"diams","name":"6"},{"suit":"diams","name":"7"},{"suit":"diams","name":"8"},{"suit":"diams","name":"9"},{"suit":"diams","name":"10"}]],"slots":[[{"suit":"diams","name":"K","returned":false}],[],[],[],[],[],[]],"stub":{"cards":[{"suit":"diams","name":"J"}],"returnedCards":[{"suit":"diams","name":"Q","returned":true}]}}';
    systemUnderTest.restore(startGame);
    // do Move
    expect(JSON.stringify(systemUnderTest.dump())).toBe(endGameDump);
    // let card = systemUnderTest.kingSlots[3].cards[9];
    // expect(card.value).toBe(10);
    // expect(card.suit).toBe('diams');
  });
});
