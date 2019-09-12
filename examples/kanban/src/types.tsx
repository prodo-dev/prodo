import { Collection } from "@prodo/firestore";

export type Board = {
  id: string;
  title: string;
  color: string;
  users: string[];
  lists: string[];
};

export type User = {
  id: string;
  name: string;
  imageUrl: string;
  boards: string[];
};

export type DB = {
  users: Collection<User>;
  cardsById: Collection<Card>;
  listsById: Collection<List>;
  boardsById: Collection<Board>;
};

export type List = {
  id: string;
  title: string;
  cards: string[];
};

export type Card = {
  id: string;
  text: string;
  color?: string;
  date?: Date;
};

export type State = {
  userId?: string;
  currentBoardId?: string;
};
