import { useState } from "react";
import { type ICard, type GameState } from "../models";
import { GameStart } from "../models";
import card_back from "/img/card_back.png";
import "../styles.css";
import { cards } from "../data/card";

interface CardProps {
  card: ICard;
}

export function Product(props: CardProps) {
  const [array, setArray] = useState<GameState>(() => GameStart());
  const [count, setCount] = useState(0);
  const [draggedCard, setDraggedCard] = useState<ICard>();
  const [draggedGroup, setDraggedGroup] = useState<ICard[]>([]);

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

    if (!current) return false;

    const stack = current.stack;
    if (
      (stack.length > 0 && card.rank === stack[stack.length - 1].rank + 1) ||
      (stack.length === 0 && card.rank === 1)
    ) {
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
      return true;
    }
  };

  //// Функция для удаления карты ////

  const deleteCardfromTableau = (card: ICard) => {
    setArray((prev) => {
      let new_tableau = prev.tableau.map((chunk) =>
        chunk
          .filter((data) => data.id !== card.id)
          .map((card, index, arr) => (index === arr.length - 1 ? { ...card, face: true } : card)),
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

  function dragStartHandler(e: React.DragEvent<HTMLElement>, card: ICard) {
    if (card.face == true) {
      setDraggedCard(card);
      const columnIndex = array.tableau.findIndex((data) => data.includes(card));
      if (columnIndex === -1) {
        setDraggedGroup([card]);
      } else {
        const column = array.tableau[columnIndex];
        const cardIndex = column.findIndex((data) => data.id == card.id);
        const group = column.slice(cardIndex);
        setDraggedGroup(group);
      }
    }
  }

  function dropHandler(e: React.DragEvent<HTMLElement>, card?: ICard, index?: number) {
    e.preventDefault();
    if (!draggedCard) return;

    if (index !== undefined && array.tableau[index].length == 0) {
      setArray((prev) => {
        const dragged_card_column = prev.tableau.findIndex((data) => data.includes(draggedCard));
        const dragged_card_surface_column = prev.surface_cards.findIndex(
          (data) => data.id == draggedCard.id,
        );
        const deleteFromOldColumnSurface = prev.surface_cards.filter(
          (card) => card.id !== draggedCard.id,
        );

        if (dragged_card_surface_column === -1) {
          const deleteFromOldColumnTableau = prev.tableau[dragged_card_column]
            .filter((card) => !draggedGroup.some((g) => g.id === card.id))
            .map((card, index, arr) => (index === arr.length - 1 ? { ...card, face: true } : card));
          const newTableauColumn = prev.tableau.map((column, i) => {
            if (i === index) {
              return [...column, ...draggedGroup];
            }
            if (i === dragged_card_column) {
              return deleteFromOldColumnTableau;
            }

            return column;
          });
          return { ...prev, tableau: newTableauColumn };
        } else {
          const newTableauColumn = prev.tableau.map((column, i) => {
            if (i === index) {
              return [...column, ...draggedGroup];
            }

            return column;
          });
          return { ...prev, tableau: newTableauColumn, surface_cards: deleteFromOldColumnSurface };
        }
      });
    } else {
      e.stopPropagation();
      if (!card) return;
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
          const newColumn = [...prev.tableau[dropped_card], ...draggedGroup];

          const deleteFromOldSurface = prev.surface_cards.filter(
            (card) => card.id !== draggedCard.id,
          );

          if (dragged_card_surface === -1) {
            const deleteFromOldTableau = prev.tableau[dragged_card]
              .filter((card) => !draggedGroup.some((g) => g.id === card.id))
              .map((card, index, arr) =>
                index === arr.length - 1 ? { ...card, face: true } : card,
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
  }
  const nextIndex = () => {
    count < array.surface_cards.length - 1 ? setCount(count + 1) : setCount(0);
  };

  const totalColumns: number = 7;

  return (
    <>
      <main>
        <section className="deck">
          <div>
            <button onClick={nextIndex}>Next card</button>
            <span
              draggable={true}
              onDragStart={(e) => dragStartHandler(e, array.surface_cards[count])} // Взятие карточки
              onClick={() => {
                if (addToFinalStack(array.surface_cards[count])) {
                  deleteCardfromSurface();
                  setCount(0);
                  clubs.length + spades.length + hearts.length + diamonds.length === 52;
                }
              }}
            >
              {array.surface_cards[count] && <img src={array.surface_cards[count].img} />}
            </span>
          </div>
          <div>
            <button
              className="restart_button"
              onClick={() => {
                setArray(GameStart());
                setClubs([]);
                setSpades([]);
                setHearts([]);
                setDiamonds([]);
                setCount(0);
                setDraggedCard(undefined);
                setDraggedGroup([]);
              }}
            >
              <img src="/img/restart.png" alt="" className="restart_photo" />
            </button>
          </div>
          <div className="finalStack">
            <div className="finalStack">
              <div className="clubs_stack">
                <span className="stack_title">Крести</span>

                {clubs.length > 0 && <img src={clubs[clubs.length - 1].img} alt="" />}
              </div>

              <div className="spades_stack">
                <span className="stack_title">Пики</span>
                {spades.length > 0 && <img src={spades[spades.length - 1].img} alt="" />}
              </div>

              <div className="diamonds_stack">
                <span className="stack_title">Бубны</span>
                {diamonds.length > 0 && <img src={diamonds[diamonds.length - 1].img} alt="" />}
              </div>

              <div className="hearts_stack">
                <span className="stack_title">Сердца</span>
                {hearts.length > 0 && <img src={hearts[hearts.length - 1].img} alt="" />}
              </div>
            </div>
          </div>
        </section>
        <section
          className="field"
          style={{ display: "grid", gridTemplateColumns: "repeat(7, 100px)" }}
        >
          {Array.from({ length: totalColumns }, (_, divIndex) => (
            <div
              onDrop={(e) => dropHandler(e, undefined, divIndex)}
              onDragOver={(e) => e.preventDefault()}
              key={`div-${divIndex}`}
              className="field_item"
            >
              {array.tableau[divIndex]?.map((card, spanIndex) => (
                <span
                  draggable={card.face}
                  key={`span-${divIndex}-${spanIndex}`}
                  onDragStart={(e) => dragStartHandler(e, card)} // Взятие карточки
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => dropHandler(e, card)} // Отпустили карту
                  onClick={() => {
                    if (addToFinalStack(card)) {
                      deleteCardfromTableau(card);
                      clubs.length + spades.length + hearts.length + diamonds.length === 52;
                    }
                  }}
                >
                  {card.face ? <img src={card.img} /> : <img src={card_back} />}
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
