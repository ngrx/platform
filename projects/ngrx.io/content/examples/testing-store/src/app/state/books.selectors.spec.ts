import { selectBooks, selectBookCollection } from "./books.selectors";
import { AppState } from "./app.state";

describe("Selectors", () => {
  const initialState: AppState = {
    books: [
      {
        id: "firstId",
        volumeInfo: {
          title: "First Title",
          authors: ["First Author"],
        },
      },
      {
        id: "secondId",
        volumeInfo: {
          title: "Second Title",
          authors: ["Second Author"],
        },
      },
    ],
    collection: ["firstId"],
  };

  it("should select the book list", () => {
    const result = selectBooks.projector(initialState.books);
    expect(result.length).toEqual(2);
    expect(result[1].id).toEqual("secondId");
  });

  it("should select the book collection", () => {
    const result = selectBookCollection.projector(
      initialState.books,
      initialState.collection
    );
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual("firstId");
  });
});
