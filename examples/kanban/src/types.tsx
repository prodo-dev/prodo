export type Board = {
  _id: string;
  title: string;
  color: string;
  users: string[];
  lists: string[];
};

export type List = {
  _id: string;
  title: string;
  cards: string[];
};

export type Card = {
  _id: string;
  text: string;
  color?: string;
  date?: Date;
};

export type State = {
  user?: { _id: string; name: string; imageUrl: string };
  isGuest?: boolean;
  currentBoardId?: string;
  cardsById: { [key: string]: Card };
  listsById: { [key: string]: List };
  boardsById: { [key: string]: Board };
};
