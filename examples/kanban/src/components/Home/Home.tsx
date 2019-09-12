import * as React from "react";
import { Link } from "react-router-dom";
import { Title } from "react-head";
import slugify from "slugify";
import classnames from "classnames";
import Header from "../Header/Header";
import BoardAdder from "./BoardAdder";
import "./Home.scss";
import { state, watch } from "../../model";

function Home() {
  const boardsById = watch(state.boardsById);
  const boards = Object.keys(boardsById).map(key => boardsById[key]);
  const listsById = watch(state.listsById);
  return (
    <>
      <Title>Home | React Kanban</Title>
      <Header />
      <div className="home">
        <div className="main-content">
          <h1>Boards</h1>
          <div className="boards">
            {boards.map(board => (
              <Link
                key={board._id}
                className={classnames("board-link", board.color)}
                to={`/b/${board._id}/${slugify(board.title, {
                  lower: true
                })}`}
              >
                <div className="board-link-title">{board.title}</div>
                <div className="mini-board">
                  {board.lists.map(listId => (
                    <div
                      key={listId}
                      className="mini-list"
                      style={{
                        height: `${Math.min(
                          (listsById[listId].cards.length + 1) * 18,
                          100
                        )}%`
                      }}
                    />
                  ))}
                </div>
              </Link>
            ))}
            <BoardAdder />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
