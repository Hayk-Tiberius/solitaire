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
  const [draggedCard, setDraggedCard] = useState<ICard>();

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
      return { ...prev, tableau: new_tableau };
    });
  };

  const deleteCardfromSurface = () => {
    setArray((prev) => {
      let new_surface = prev.surface_cards.filter(
        (data) => data.id !== array.surface_cards[count].id,
      );
      return { ...prev, surface_cards: new_surface };
    });
  };

  //// Функция для передвижения карты ////

  function dragStartHandler(e, card: ICard) {
    console.log("drag", card);
    setDraggedCard(card);
  }

  function dropHandler(e, card: ICard) {
    e.preventDefault();
    if (!draggedCard) return;
    if (
      card.color != draggedCard.color &&
      card.rank == draggedCard.rank + 1 &&
      array.tableau.find((data) => data.includes(card) && card.id == data[data.length - 1].id)
    ) {
      setArray((prev) => {
        let dropped_card = prev.tableau.findIndex((data) => data.includes(card));
        let dragged_card = prev.tableau.findIndex((data) => data.includes(draggedCard));
        let dragged_card_surface = prev.surface_cards.findIndex(
          (data) => data.id == draggedCard.id,
        );
        const newColumn = [...prev.tableau[dropped_card], draggedCard];

        const deleteFromOldSurface = prev.surface_cards.filter(
          (card) => card.id !== draggedCard.id,
        );

        if (dragged_card_surface === -1) {
          const deleteFromOldTableau = prev.tableau[dragged_card].filter(
            (card) => card.id !== draggedCard.id,
          );
          const newTableau = prev.tableau.map((column, index) => {
            if (index === dropped_card) {
              return newColumn;
            }

            if (index === dragged_card) {
              return deleteFromOldTableau;
            }

            return column;
          });
          return { ...prev, tableau: newTableau };
        } else {
          const newTableau = prev.tableau.map((column, index) => {
            if (index === dropped_card) {
              return newColumn;
            }

            return column;
          });
          return { ...prev, tableau: newTableau, surface_cards: deleteFromOldSurface };
        }
      });
    } else {
      return;
    }
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
          <span
            draggable={true}
            onDragStart={(e) => dragStartHandler(e, array.surface_cards[count])} // Взятие карточки
            onClick={() => {
              addToFinalStack(array.surface_cards[count]);
              deleteCardfromSurface();
            }}
          >{`${array.surface_cards[count].name} of ${array.surface_cards[count].suit}`}</span>
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
                  onDragStart={(e) => dragStartHandler(e, card)} // Взятие карточки
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => dropHandler(e, card)} // Отпустили карту
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
