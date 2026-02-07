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

export const min: number = 1;

export const max: number = cards.length;

export interface GameState {
  card_pack: ICard[];
  surface_cards: ICard[];
  tableau: ICard[][];
}

export interface CardSize {
  maxId: number;
  minId: number;
}

function GameStart(): GameState {
  let unique = new Set<number>();
  while (unique.size < cards.length) {
    let n = Math.floor(Math.random() * cards.length);
    unique.add(n);
  }

  let card_pack: ICard[] = [...unique].map((index) => cards[index]);
  let surface_cards = card_pack.slice(28);
  let arr_field = card_pack.slice(0, 28);

  let chunkSize = 1;
  const tableau: ICard[][] = [];
  while (arr_field.length) {
    tableau.push(arr_field.splice(0, chunkSize));
    chunkSize += 1;
  }

  return { card_pack, surface_cards, tableau };
}

export { GameStart };
