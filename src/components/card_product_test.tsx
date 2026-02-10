import { useState } from "react";
import { type ICard, type GameState } from "../models";
import { GameStart } from "../models";

interface CardProps {
  card: ICard;
}

export function Product2(props: CardProps) {
  const [deck, setDeck] = useState<GameState>(() => GameStart());

  console.log(deck.surface_cards);
  console.log(deck.tableau);
  return "hello";
}
