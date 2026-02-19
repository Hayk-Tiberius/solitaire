import { cards } from "./data/card";

export interface ICard {
  id: number;
  rank: number;
  suit: Suit;
  color: string;
  name: string;
  face: boolean;
}
type Suit = "Clubs" | "Spades" | "Diamonds" | "Hearts";

export interface GameState {
  card_pack: ICard[];
  tableau: ICard[][];
}

export const min: number = 1;

export const max: number = cards.length;

export interface CardSize {
  maxId: number;
  minId: number;
}

function GameStart(): GameState {
  function uniqueCard(unique = new Set<number>()) {
    while (unique.size < cards.length) {
      let n = Math.floor(Math.random() * cards.length);
      unique.add(n);
    }

    let card_pack: ICard[] = [...unique].map((index) => cards[index]);
    return { card_pack };
  }

  let unique_cards = uniqueCard();
  function createDeck(unique_cards: ICard[]) {
    let deck = unique_cards.slice(28);
    let arr_field = unique_cards.slice(0, 28);

    return { deck, arr_field };
  }

  const { deck: arr_deck, arr_field } = createDeck(unique_cards);
  function chunkArray(arr_field: ICard[]) {
    let chunkSize = 1;
    const tableau: ICard[][] = [];
    while (arr_field.length) {
      tableau.push(arr_field.splice(0, chunkSize));
      chunkSize += 1;
    }
    return { tableau };
  }
}

export { unique_cards, chunkArray, arr_deck };
