import { Product } from "../src/components/cards_products";
import { cards } from "../src/data/card";

const App = () => {
  return (
    <>
      {" "}
      <h1>Hello</h1>
      <h2>hello</h2>
      <Product card={cards[0]} />
    </>
  );
};

export default App;
