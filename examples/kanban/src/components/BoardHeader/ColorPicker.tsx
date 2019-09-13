import * as React from "react";
import { withRouter } from "react-router-dom";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import classnames from "classnames";
// @ts-ignore
import FaCheck from "react-icons/lib/fa/check";
// @ts-ignore
import colorIcon from "../../assets/images/color-icon.png";
import "./ColorPicker.scss";
import { state, watch, dispatch } from "../../model";

type Props = {
  match: { params: { boardId: string } };
};

function changeBoardColor(boardId, color) {
  console.log("changeBoardColor", { boardId, color });
  state.boardsById[boardId].color = color;
}

function ColorPicker({ match }: Props) {
  const { boardId } = match.params;
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

export default withRouter(ColorPicker);
