import stableStringify from "fast-stable-stringify";
import * as _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import { isMac, isValidJson, keys } from "../../utils";
import Editor from "./Editor";
import { format } from "./Editor/format";
import JsonTree from "./JsonTree";

const StyledEditor = styled.div<{ show: boolean }>`
  margin-left: -10px;
  display: ${props => (props.show ? "block" : "none")};
`;

const StyledHeader = styled.div`
  height: 20px;
  text-align: right;
`;

const CodeButtonContainer = styled.span<{ fullMode: boolean }>`
  color: ${props => (props.fullMode ? "white" : "darkgrey")};
  cursor: pointer;
`;

interface Props {
  data: { [key: string]: any };
  jsonFile: string;
  disabled: boolean;
  onDeltaUpdate?: (args: {
    key: string;
    keyPath: string[];
    newValue: any;
    oldValue: any;
  }) => any;
  onFullUpdate?: (args: { newValue: any }) => any;
  liveUpdate?: boolean;
}

const EditorSection = (props: Props) => {
  const [edited, setEdited] = React.useState(props.data || {});
  const [editedString, setEditedString] = React.useState("");

  const [showFullEditor, setShowFullEditor] = React.useState(false);
  const [validJson, setValidJson] = React.useState(true);

  const formatData = async () => {
    const formatted = await format(JSON.stringify(props.data || {}), "json");
    setEditedString(formatted);
  };

  React.useEffect(() => {
    (async () => {
      if (!_.isEqual(props.data, edited)) {
        formatData();
        setEdited(props.data || {});
      }
    })();
  }, [stableStringify(props.data)]);

  const onFullUpdate = () => {
    if (isValidJson(editedString)) {
      const value = JSON.parse(editedString);
      if (props.onFullUpdate != null) {
        props.onFullUpdate({ newValue: value });
      }
      setEdited(value);
      setShowFullEditor(false);
    } else {
      setValidJson(false);
    }
  };

  const onEditFullJson = (value: string) => {
    if (editedString.trim().localeCompare(value.trim()) !== 0) {
      setEditedString(value);
      setValidJson(isValidJson(value));

      if (isValidJson(value)) {
        const parsedValue = JSON.parse(value);
        setEdited(parsedValue);
        if (props.liveUpdate && props.onFullUpdate != null) {
          props.onFullUpdate({
            newValue: parsedValue,
          });
        }
      }
    }
  };

  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (isMac ? e.metaKey : e.ctrlKey) {
        if (e.keyCode === keys.s) {
          onFullUpdate();
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  });

  return (
    <React.Fragment>
      <StyledHeader>
        {!props.disabled &&
          (showFullEditor ? (
            validJson && (
              <CodeButtonContainer
                fullMode={true}
                onClick={() => {
                  onFullUpdate();
                }}
              >
                save
              </CodeButtonContainer>
            )
          ) : (
            <CodeButtonContainer
              fullMode={false}
              onClick={() => {
                formatData();
                setShowFullEditor(!false);
              }}
            >
              edit
            </CodeButtonContainer>
          ))}
      </StyledHeader>

      <StyledEditor show={showFullEditor}>
        <Editor
          files={[
            {
              path: props.jsonFile,
              value: editedString,
            },
          ]}
          currentFile={{
            path: props.jsonFile,
            value: editedString,
          }}
          dependencies={{}}
          onChangeValue={(_, value) => onEditFullJson(value)}
          autoHeight={true}
          hidden={!showFullEditor}
          editorOptions={{
            lineNumbers: "off",
            scrollBeyondLastLine: false,
            formatOnType: true,
            folding: false,
            // fontSize: parseInt(darkTheme.fontSizes.code, 10),
          }}
        />
      </StyledEditor>

      {!showFullEditor && (
        <JsonTree
          value={edited}
          onDeltaUpdate={props.onDeltaUpdate}
          readOnly={props.disabled}
        />
      )}
    </React.Fragment>
  );
};

export default EditorSection;
