import { useState } from "react";
import { type ICard, type GameState } from "../models";
import { GameStart } from "../models";

interface CardProps {
  card: ICard;
}

export function Product(props: CardProps) {
  const [array, _] = useState<GameState>(() => GameStart());
  const [count, setCount] = useState(0);

  //// Хук для сбора финального стэка тут /////

  const [clubs, setClubs] = useState<ICard[]>([]);
  const [spades, setSpades] = useState<ICard[]>([]);
  const [hearts, setHearts] = useState<ICard[]>([]);
  const [diamonds, setDiamonds] = useState<ICard[]>([]);

  const addToFinalStack = (card: ICard) => {
    const suitMap = {
      Clubs: { stack: clubs, fn: setClubs },
      Spades: { stack: spades, fn: setSpades },
      Hearts: { stack: hearts, fn: setHearts },
      Diamonds: { stack: diamonds, fn: setDiamonds },
    };

    const current = suitMap[card.suit];

    if (!current) return;

    current.fn((prev) => {
      if (prev.length === 0) {
        if (card.rank === 1) {
          return [card];
        }
        return prev;
      }

      const topCard = prev[prev.length - 1];

      if (card.rank === topCard.rank + 1) {
        return [...prev, card];
      }

      return prev;
    });
  };

  ////////////////////////////

  const nextIndex = () => {
    count < array.surface_cards.length - 1 ? setCount(count + 1) : setCount(0);
  };

  const totalColumns: number = 7;

  return (
    <>
      <main>
        <section className="deck">
          <button onClick={nextIndex}>Next card</button>
          <span>{`${array.surface_cards[count].name} of ${array.surface_cards[count].suit}`}</span>
        </section>
        <section className="finalStack">
          <div className="clubs_stack">Крести {clubs.length}</div>
          <div className="spades_stack">Пики {spades.length}</div>
          <div className="diamonds_stack">Бубны {diamonds.length}</div>
          <div className="hearts_stack">Сердца {hearts.length}</div>
        </section>
        <section
          className="field"
          style={{ display: "grid", gridTemplateColumns: "repeat(7, 100px)" }}
        >
          {Array.from({ length: totalColumns }, (_, divIndex) => (
            <div key={`div-${divIndex}`}>
              {Array.from({ length: divIndex + 1 }, (_, spanIndex) => (
                <span
                  key={`span-${divIndex}-${spanIndex}`}
                  onClick={() => {
                    addToFinalStack(array.tableau[divIndex][spanIndex]);
                  }}
                >
                  {`${array.tableau[divIndex][spanIndex].name} of ${array.tableau[divIndex][spanIndex].suit}`}
                  <br />
                </span>
              ))}
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
