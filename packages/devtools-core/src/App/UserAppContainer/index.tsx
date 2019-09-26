import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { dispatch } from "../../model";
import { eventListener } from "../../utils/communication";
import ErrorBoundary from "./ErrorBoundary";

const StyledUserAppContainer = styled.div`
  flex-grow: 1;
  text-align: center;
`;

const StyledIFrame = styled.iframe`
  min-height: 100vh;
  height: 100%;
  width: 100%;

  border: none;
`;

interface Props {
  url?: string;
  children?: React.ReactNode;
}

const UserAppContainer = (props: Props) => {
  const iFrameRef = React.useRef<HTMLIFrameElement>(null);
  const [updateValue, forceUpdate] = React.useState(true);
  const [styleNodes] = React.useState([] as any[]);

  // Forces a re-render
  const handleLoad = () => {
    forceUpdate(!updateValue);
  };

  React.useEffect(() => {
    if (iFrameRef && iFrameRef.current && iFrameRef.current.contentWindow) {
      iFrameRef.current.contentWindow.addEventListener("load", handleLoad);
      iFrameRef.current.contentWindow.addEventListener(
        "message",
        eventListener(dispatch),
      );
      if (iFrameRef && iFrameRef.current && iFrameRef.current.contentDocument) {
        document.head.childNodes.forEach((link: ChildNode) => {
          if ((link as any).tagName === "STYLE") {
            const content = (link as any).innerHTML;
            // We use styled components too, so append a copy
            if (content.includes("sc-component-id:")) {
              const copy = link.cloneNode(true);
              styleNodes.push(copy);
            } else if (!content.includes("prodoDevtoolsStyles")) {
              styleNodes.push(link);
            }
          }
        });
        styleNodes.forEach(link => {
          iFrameRef.current!.contentDocument!.head.appendChild(link);
        });
      }
      return () => {
        if (iFrameRef && iFrameRef.current && iFrameRef.current.contentWindow) {
          iFrameRef.current.removeEventListener("load", handleLoad);
          iFrameRef.current.contentWindow.removeEventListener(
            "message",
            eventListener(dispatch),
          );
        }
      };
    }
  });

  const renderFrameContents = () => {
    if (iFrameRef && iFrameRef.current && iFrameRef.current.contentDocument) {
      return [
        ReactDOM.createPortal(
          props.children,
          iFrameRef.current.contentDocument.body,
        ),
      ];
    }
    return [];
  };

  return (
    <StyledUserAppContainer
      className="userAppContainer"
      data-testid="userAppContainer"
    >
      <ErrorBoundary>
        {props.url ? (
          <StyledIFrame
            ref={iFrameRef}
            src={props.url}
            className="iframe"
            data-testid="iframe"
            onLoad={handleLoad}
          />
        ) : (
          <StyledIFrame ref={iFrameRef} className="iframe" data-testid="iframe">
            {renderFrameContents()}
          </StyledIFrame>
        )}
      </ErrorBoundary>
    </StyledUserAppContainer>
  );
};

export default UserAppContainer;
