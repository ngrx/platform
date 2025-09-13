export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: Array<string>;
  };
}
