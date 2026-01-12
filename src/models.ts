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
