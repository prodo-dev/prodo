import { Collection } from "@prodo/firestore";

export type Board = {
  id: string;
  title: string;
  color: string;
  users: string[];
  lists: string[];
};

export type DB = {
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
  user?: { _id: string; name: string; imageUrl: string };
  isGuest?: boolean;
  currentBoardId?: string;
};
