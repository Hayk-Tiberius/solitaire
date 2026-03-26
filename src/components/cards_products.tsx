import { useState } from "react";
import { type ICard, type GameState } from "../models";
import { GameStart } from "../models";
import { cards } from "../data/card";

interface CardProps {
  card: ICard;
}

export function Product(props: CardProps) {
  const [array, setArray] = useState<GameState>(() => GameStart());
  const [count, setCount] = useState(0);

  //// Функция для сбора финального стэка тут /////

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

  //// Функция для удаления карты ////

  const deleteCardfromTableau = () => {
    setArray((prev) => {
      const allStacks = [...spades, ...clubs, ...hearts, ...diamonds];

      let new_tableau = prev.tableau.map((chunk) =>
        chunk.filter((data) => !allStacks.includes(data)),
      );
      console.log(new_tableau);
      return { ...prev, tableau: new_tableau };
    });
  };

  //// Функция для передвижения карты ////

  function dragStartHandler(e, card) {
    console.log("drag", card);
  }

  function dragLeaveHandler(e) {}

  function dragOverHandler(e) {
    e.preventDefault();
  }

  function dragEndHandler(e) {}

  function dropHandler(e, card) {
    e.preventDefault();
    console.log("drop", card);
    setArray((prev) => {
      let dropped_card = prev.tableau.map((drop) => drop.filter((data) => console.log(data)));
      return { ...prev, tableau: dropped_card };
    });
  }

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
              {array.tableau[divIndex]?.map((card, spanIndex) => (
                <span
                  style={{ border: "1px solid black" }}
                  draggable={true}
                  key={`span-${divIndex}-${spanIndex}`}
                  onDragStart={(e) => dragStartHandler(e, card)}
                  onDragLeave={(e) => dragLeaveHandler(e)}
                  onDragOver={(e) => dragOverHandler(e)}
                  onDragEnd={(e) => dragEndHandler(e)}
                  onDrop={(e) => dropHandler(e, card)}
                  onClick={() => {
                    addToFinalStack(card);
                    deleteCardfromTableau();
                  }}
                >
                  {`${card.name} of ${card.suit}`}
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
