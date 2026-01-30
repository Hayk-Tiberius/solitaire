import { useState } from "react";
import { type ICard } from "../models";
import { arr_deck, chunkedArray } from "../models";

interface CardProps {
  card: ICard;
}

export function Product(props: CardProps) {
  const [array, _] = useState(arr_deck);
  const [count, setCount] = useState(0);

  //// Хук для финального стэка тут /////

  const [clubs, setClubs] = useState<ICard[]>([]);
  const [spades, setSpades] = useState<ICard[]>([]);
  const [diamonds, setDiamonds] = useState<ICard[]>([]);
  const [hearts, setHearts] = useState<ICard[]>([]);

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
          <div className="clubs_stack">Крести</div>
          <div className="spades_stack">Пики</div>
          <div className="diamonds_stack">Бубе</div>
          <div className="hearts_stack">Сердца</div>
        </section>
        <section
          className="field"
          style={{ display: "grid", gridTemplateColumns: "repeat(7, 100px)" }}
        >
          {Array.from({ length: totalColumns }, (_, divIndex) => (
            <div key={`div-${divIndex}`}>
              {Array.from({ length: divIndex + 1 }, (_, spanIndex) => (
                <span key={`span-${divIndex}-${spanIndex}`}>
                  {`${chunkedArray[divIndex][spanIndex].name} of ${chunkedArray[divIndex][spanIndex].suit}`}
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
