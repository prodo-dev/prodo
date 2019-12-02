import * as React from "react";
import styled from "styled-components";

const CopyButtonContainer = styled.div`
  position: absolute;
  right: 0.2rem;
  top: 1.4rem;
`;

const StyledCopyButton = styled.button`
  appearance: none;
  background-color: transparent;
  color: #9aa8ff;
  opacity: 0.6;
  border: none;
  font-size: 0.8em;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 250ms ease-in-out;

  &:hover {
    opacity: 1;
  }
`;

const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  document.execCommand("copy");
  document.body.removeChild(textArea);
};

const copyTextToClipboard = (text: string) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text);
};

const CopyButton: React.FC<{ content: string }> = props => {
  const [text, setText] = React.useState("copy");

  const copy = () => {
    copyTextToClipboard(props.content);
    setText("copied!");

    setTimeout(() => {
      setText("copy");
    }, 1000);
  };

  return (
    <CopyButtonContainer>
      <StyledCopyButton onClick={copy}>{text}</StyledCopyButton>
    </CopyButtonContainer>
  );
};

export default CopyButton;
