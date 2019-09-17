import { matchRoute } from "@prodo/route";
import classnames from "classnames";
import * as React from "react";
import { Button, Menu, MenuItem, Wrapper } from "react-aria-menubutton";
// @ts-ignore
import FaCheck from "react-icons/lib/fa/check";
// @ts-ignore
import colorIcon from "../../assets/images/color-icon.png";
import { dispatch, route, state, watch } from "../../model";
import "./ColorPicker.scss";

function changeBoardColor(boardId, color) {
  state.boardsById[boardId].color = color;
}

function ColorPicker() {
  const path = watch(route.path);
  const { boardId } = matchRoute(path, "/b/:boardId");
  const boardColor = watch(state.boardsById[boardId].color);

  const colors = ["blue", "green", "red", "pink"];
  return (
    <Wrapper
      className="color-picker-wrapper"
      onSelection={(color: string) =>
        dispatch(changeBoardColor)(boardId, color)
      }
    >
      <Button className="color-picker">
        <img src={colorIcon} alt="colorwheel" className="modal-icon" />
        <div className="board-header-right-text">&nbsp;Color &nbsp;&#9662;</div>
      </Button>
      <Menu className="color-picker-menu">
        {colors.map(color => (
          <MenuItem
            value={color}
            className={classnames("color-picker-item", color)}
            key={color}
          >
            {color === boardColor && <FaCheck />}
          </MenuItem>
        ))}
      </Menu>
    </Wrapper>
  );
}

export default ColorPicker;
