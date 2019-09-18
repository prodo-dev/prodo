import { State } from "../src/types";
export const initState: State = {
  user: {
    _id: "ted",
    name: "ted",
    imageUrl: "https://profiles.utdallas.edu/img/default.png",
  },
  currentBoardId: "B1",
  boardsById: {
    B1: {
      _id: "B1",
      title: "todos",
      color: "blue",
      lists: ["L1", "L2"],
      users: ["ted"],
    },
  },
  listsById: {
    L1: { _id: "L1", title: "doing", cards: ["C1", "C2"] },
    L2: { _id: "L2", title: "done-ish", cards: ["C3"] },
  },
  cardsById: {
    C1: { _id: "C1", text: "Hello", date: new Date(), color: "white" },
    C2: { _id: "C2", text: "World", date: new Date(), color: "green" },
    C3: { _id: "C3", text: "everything", date: new Date(), color: "blue" },
  },
};
