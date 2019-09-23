import * as React from "react";
import styled from "styled-components";
import { margins, paddings } from "../../styles";

interface Props {
  children?: React.ReactNode;
}

interface State {
  boundary?: {
    error: Error;
    info: React.ErrorInfo;
  };
}

const CodeBlock = styled.pre`
  display: block;
  padding: ${paddings.small};
  margin: ${margins.small};
  overflow-x: auto;
  white-space: pre-wrap;
  border-radius: 0.25rem;
  background-color: rgba(206, 17, 38, 0.05);
  font-size: ${props => props.theme.fontSizes.code};
`;

const Header = styled.span`
  font-size: 110%;
`;

const ErrorMessage = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  margin: ${margins.medium};
  padding: ${paddings.medium};
  box-sizing: border-box;
  text-align: left;
  font-family: ${props => props.theme.fonts.code};
  font-size: ${props => props.theme.fontSizes.code};
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
  background-color: ${props => props.theme.colors.errorBg};
  color: ${props => props.theme.colors.error};
  box-shadow: 0 0 0 1px #e0b4b4 inset, 0 0 0 0 transparent;
  border-radius: 0.3rem;
`;

export default class extends React.Component<Props> {
  public state: State = {
    boundary: undefined,
  };

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ boundary: { error, info } });
  }

  public render() {
    const boundary = this.state.boundary;
    if (boundary != null) {
      return (
        <ErrorMessage className="error-message">
          Sorry, something went wrong:
          <CodeBlock>
            <Header>Error: {boundary.error.message}</Header>
            {boundary.info.componentStack}
          </CodeBlock>
        </ErrorMessage>
      );
    }

    return this.props.children;
  }
}
