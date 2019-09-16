import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { dispatch } from "../model";
import { eventListener } from "../utils/communication";

const StyledIFrame = styled.iframe`
  flex-grow: 1;

  min-height: calc(100vh - 2rem);
  height: 100%;

  min-width: 50%;

  border: none;
`;

interface Props {
  url?: string;
  children?: React.ReactNode;
}

const UserAppContainer = (props: Props) => {
  const iFrameRef = React.useRef<HTMLIFrameElement>(null);
  const [updateValue, forceUpdate] = React.useState(true);

  // Forces a re-render (forceUpdate replacement) (TODO verify)
  const handleLoad = () => {
    console.log("handleLoad");
    forceUpdate(!updateValue);
  };

  React.useEffect(() => {
    if (iFrameRef && iFrameRef.current && iFrameRef.current.contentWindow) {
      iFrameRef.current.addEventListener("load", handleLoad);
      iFrameRef.current.contentWindow.addEventListener(
        "message",
        eventListener(dispatch),
      );
      return () => {
        window.removeEventListener("load", handleLoad);
        window.removeEventListener("message", eventListener(dispatch));
      };
    }
  }, []);

  const renderFrameContents = () => {
    if (iFrameRef && iFrameRef.current && iFrameRef.current.contentDocument) {
      const cssLink = document.createElement("link");
      cssLink.href = "style.css";
      document.head.childNodes.forEach((link: any) => {
        if (link.tagName === "LINK" && link.rel === "stylesheet") {
          cssLink.href = link.href;
        }
      });
      cssLink.rel = "stylesheet";
      cssLink.type = "text/css";
      iFrameRef.current.contentDocument.head.appendChild(cssLink);

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
    <>
      {props.url ? (
        <StyledIFrame ref={iFrameRef} src={props.url} />
      ) : (
        <StyledIFrame ref={iFrameRef}>{renderFrameContents()}</StyledIFrame>
      )}
    </>
  );
};

export default UserAppContainer;
