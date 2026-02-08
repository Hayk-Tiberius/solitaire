import { cards } from "./data/card";

export interface ICard {
  id: number;
  rank: number;
  suit: string;
  color: string;
  name: string;
  face: boolean;
}

export const min: number = 1;

export const max: number = cards.length;

export interface CardSize {
  maxId: number;
  minId: number;
}

let count = 52;

function uniqueCard(unique = new Set<number>()) {
  while (unique.size < count) {
    let n = Math.floor(Math.random() * 52);
    unique.add(n);
  }

  let arr_unique: ICard[] = [...unique].map((index) => cards[index]);
  return arr_unique;
}

let unique_cards = uniqueCard();
function createDeck(unique_cards: ICard[]) {
  let deck = unique_cards;
  let arr_field: ICard[] = [];
  for (let i: number = 0; i < 28; i++) {
    arr_field.push(unique_cards[i]);
  }
  for (let i: number = 0; i < 28; i++) {
    deck.shift();
  }
  return { deck, arr_field };
}

const { deck: arr_deck, arr_field } = createDeck(unique_cards);

function chunkArray(arr_field: ICard[]) {
  let chunkSize = 1;
  const chunkedArray: ICard[][] = [];
  while (arr_field.length) {
    chunkedArray.push(arr_field.splice(0, chunkSize));
    chunkSize += 1;
  }
  return chunkedArray;
}

const arr_chunk = chunkArray(arr_field);

export { unique_cards, arr_chunk, arr_deck };
