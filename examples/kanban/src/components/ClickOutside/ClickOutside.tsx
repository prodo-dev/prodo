import { Component } from "react";
import onClickOutside from "react-onclickoutside";

interface Props {
  handleClickOutside: () => any;
  children?: React.ReactNode;
}

// Wrap component in this component to handle click outisde of that component
class ClickOutsideWrapper extends Component<Props> {
  public handleClickOutside = () => this.props.handleClickOutside();
  public render = () => this.props.children;
}

export default onClickOutside(ClickOutsideWrapper);
