import { Collection } from "@prodo/firestore";

export type Board = {
  _id: string;
  title: string;
  color: string;
  users: string[];
  lists: string[];
};

export type DB = {
  cardsById: Collection<Card>;
};

export type List = {
  _id: string;
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
  listsById: { [key: string]: List };
  boardsById: { [key: string]: Board };
};
