import { Component } from "react";
// @ts-ignore
import onClickOutside from "react-onclickoutside";

// Wrap component in this component to handle click outisde of that component
class ClickOutsideWrapper extends Component {
  // @ts-ignore
  public handleClickOutside = () => this.props.handleClickOutside();
  public render = () => this.props.children;
}

export default onClickOutside(ClickOutsideWrapper);
