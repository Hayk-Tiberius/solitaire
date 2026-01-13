import { Product } from "../src/components/cards_products";
import { cards } from "../src/data/card";

const App = () => {
  return (
    <>
      {" "}
      <Product card={cards[0]} />
    </>
  );
};

export default App;
