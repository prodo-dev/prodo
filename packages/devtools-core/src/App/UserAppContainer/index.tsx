import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { dispatch, state, watch } from "../../model";
import { eventListener } from "../../utils/communication";
import ErrorBoundary from "./ErrorBoundary";

const StyledUserAppContainer = styled.div`
  flex-grow: 1;
  text-align: center;
`;

const StyledIFrame = styled.iframe`
  height: 100%;
  width: 100%;

  border: none;
`;

interface Props {
  children?: React.ReactNode;
}

let prevLoc = window.location.href;
let interval = -1;

const UserAppContainer = (props: Props) => {
  const iFrameRef = React.useRef<HTMLIFrameElement>(null);
  const [updateValue, forceUpdate] = React.useState(true);
  const [styleNodes] = React.useState([] as any[]);

  // Make sure styled components update on route change
  // If they use the route plugin, we can just watch the route path
  // (Sometimes it takes a little while to load the route)
  // If not, we have to poll the location to see if it changed
  const route = watch(state.app.universe.route.path);
  const checkLocation = () => {
    if (window.location.href !== prevLoc) {
      prevLoc = window.location.href;
      copyStyleNodes();
    }
  };
  if (!route && interval === -1) {
    interval = window.setInterval(checkLocation, 100);
  } else if (route && interval !== -1) {
    window.clearInterval(interval);
    interval = -1;
  }

  // Forces a re-render
  const handleLoad = () => {
    forceUpdate(!updateValue);
  };

  React.useEffect(() => {
    if (iFrameRef && iFrameRef.current && iFrameRef.current.contentWindow) {
      iFrameRef.current.contentWindow.addEventListener(
        "message",
        eventListener(dispatch),
      );

      // Needed for Chrome
      handleLoad();
      return () => {
        if (iFrameRef && iFrameRef.current && iFrameRef.current.contentWindow) {
          iFrameRef.current.contentWindow.removeEventListener(
            "message",
            eventListener(dispatch),
          );
        }
      };
    }
  }, []);

  React.useEffect(() => {
    copyStyleNodes();
  });

  const copyStyleNodes = () => {
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
  };

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

  // onLoad={handleLoad} is needed for Firefox
  return (
    <StyledUserAppContainer
      className="userAppContainer"
      data-testid="userAppContainer"
    >
      <ErrorBoundary>
        <StyledIFrame
          ref={iFrameRef}
          className="iframe"
          data-testid="iframe"
          onLoad={handleLoad}
        >
          {renderFrameContents()}
        </StyledIFrame>
      </ErrorBoundary>
    </StyledUserAppContainer>
  );
};

export default UserAppContainer;
