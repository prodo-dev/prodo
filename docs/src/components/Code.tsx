import * as React from "react";
import styled from "styled-components";
import Highlight, { defaultProps } from "prism-react-renderer";

const StyledCode = styled.div`
  padding: 1rem 0;

  .token-line {
    height: 20.4px;
  }
`;

const Code = ({ codeString, language }) => {
  return (
    <StyledCode>
      <Highlight
        {...defaultProps}
        code={codeString}
        language={language}
        theme={undefined}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            <code className={className}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </StyledCode>
  );
};

export default Code;
