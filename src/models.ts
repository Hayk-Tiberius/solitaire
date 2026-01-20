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
let unique = new Set<number>();
while (unique.size < count) {
  let n = Math.floor(Math.random() * 52) + 1;
  unique.add(n);
}
let arr_unique: number[] = [...unique];
let arr_deck: number[] = arr_unique;

let arr_field: number[] = [];
for (let i: number = 0; i < 28; i++) {
  arr_field.push(arr_unique[i]);
}

let chunkSize = 1;
const chunkedArray: number[][] = [];
while (arr_field.length) {
  chunkedArray.push(arr_field.splice(0, chunkSize));
  chunkSize += 1;
}

console.log(chunkedArray);

for (let i: number = 0; i < 28; i++) {
  arr_deck.shift();
}

export { arr_unique, chunkedArray, arr_deck };
