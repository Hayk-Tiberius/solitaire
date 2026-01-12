import { type ICard } from "../models";
import { min, max } from "../models";

interface CardProps {
  card: ICard;
}

const field_card = Math.floor(Math.random() * (max - min) + min);

export function Product(props: CardProps) {
  return (
    <>
      <main>
        <section
          className="field"
          style={{ display: "grid", gridTemplateColumns: "repeat(7, 100px)" }}
        >
          <div>
            <span>{field_card}</span>
          </div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>6</div>
          <div>7</div>
        </section>
      </main>
    </>
  );
}
