import { useState } from "react";
import { type ICard } from "../models";
import { arr_deck } from "../models";

interface CardProps {
  card: ICard;
}

export function Product(props: CardProps) {
  const [array, _] = useState(arr_deck);
  const [count, setCount] = useState(0);

  const nextIndex = () => {
    count < arr_deck.length - 1 ? setCount(count + 1) : setCount(0);
  };

  const totalColumns: number = 7;

  return (
    <>
      <main>
        <section className="deck">
          <button onClick={nextIndex}>Next card</button>
          <span>{array[count]}</span>
        </section>
        <section
          className="field"
          style={{ display: "grid", gridTemplateColumns: "repeat(7, 100px)" }}
        >
          {Array.from({ length: totalColumns }, (_, divIndex) => (
            <div key={`div-${divIndex}`}>
              {Array.from({ length: divIndex + 1 }, (_, spanIndex) => (
                <span key={`span-${divIndex}-${spanIndex}`}>
                  {1}
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
