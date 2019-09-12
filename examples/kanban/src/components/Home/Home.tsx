import * as React from "react";
import { Link } from "react-router-dom";
import { Title } from "react-head";
import slugify from "slugify";
import classnames from "classnames";
import Header from "../Header/Header";
import BoardAdder from "./BoardAdder";
import "./Home.scss";
import { db, watch, state } from "../../model";
import Spinner from "../Spinner/Spinner";
import NotFound from "../NotFound/NotFound";

function Home() {
  const user = db.users.watch(watch(state.userId));
  if (user._fetching) return <Spinner />;
  if (user._notFound) return <NotFound />;
  const boards = user.data.boards.map((id: string) => db.boardsById.watch(id));
  return (
    <>
      <Title>Home | React Kanban</Title>
      <Header />
      <div className="home">
        <div className="main-content">
          <h1>Boards</h1>
          <div className="boards">
            {boards.map(board => {
              if (board._fetching) return <Spinner />;
              if (board._notFound) return <NotFound />;
              const heights = board.data.lists.map(listId => {
                const list = db.listsById.watch(listId);
                if (list._fetching || list._notFound) {
                  return 100;
                } else {
                  return Math.min((list.data.cards.length + 1) * 18, 100);
                }
              });
              return (
                <Link
                  key={board.data.id}
                  className={classnames("board-link", board.data.color)}
                  to={`/b/${board.data.id}/${slugify(board.data.title, {
                    lower: true,
                  })}`}
                >
                  <div className="board-link-title">{board.data.title}</div>
                  <div className="mini-board">
                    {board.data.lists.map((listId, i) => (
                      <div
                        key={listId}
                        className="mini-list"
                        style={{ height: `${heights[i]}%` }}
                      />
                    ))}
                  </div>
                </Link>
              );
            })}
            <BoardAdder />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
