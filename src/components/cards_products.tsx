import { useState } from "react";
import { type ICard } from "../models";
import { arr_deck, arr_chunk } from "../models";

interface CardProps {
  card: ICard;
}

export function Product(props: CardProps) {
  const [array, _] = useState(arr_deck);
  const [count, setCount] = useState(0);

  //// Хук для финального стэка тут /////

  const [clubs, setClubs] = useState<ICard[]>([]);
  const [cards, setCards] = useState<ICard[][]>(arr_chunk);
  const [spades, setSpades] = useState<ICard[]>([]);
  const [diamonds, setDiamonds] = useState<ICard[]>([]);
  const [hearts, setHearts] = useState<ICard[]>([]);

  const nextIndexSpadesSuit = (card: ICard) => {
    setClubs((prevClubs) => {
      if (prevClubs.length === 0) {
        if (card.suit === "Clubs" && card.rank === 1) {
          return [...prevClubs, card];
        }
        return prevClubs;
      }

      const topCard = prevClubs[prevClubs.length - 1];

      if (card.suit === "Clubs" && card.rank === topCard.rank + 1) {
        return [...prevClubs, card];
      }

      return prevClubs;
    });
  };

  ////////////////////////////

  const nextIndex = () => {
    count < arr_deck.length - 1 ? setCount(count + 1) : setCount(0);
  };

  const totalColumns: number = 7;

  return (
    <>
      <main>
        <section className="deck">
          <button onClick={nextIndex}>Next card</button>
          <span>{`${array[count].name} of ${array[count].suit}`}</span>
        </section>
        <section className="finalStack">
          <div className="clubs_stack">Крести {clubs.length}</div>
          <div className="spades_stack">Пики {clubs.length}</div>
          <div className="diamonds_stack">Бубе {clubs.length}</div>
          <div className="hearts_stack">Сердца {clubs.length}</div>
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
                    nextIndexSpadesSuit(arr_chunk[divIndex][spanIndex]);
                  }}
                >
                  {`${arr_chunk[divIndex][spanIndex].name} of ${arr_chunk[divIndex][spanIndex].suit}`}
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
