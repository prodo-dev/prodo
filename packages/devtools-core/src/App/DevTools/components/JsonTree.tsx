import { faBan, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import {
  JsonTree as EditableJsonTree,
  Props as EditableJsonTreeProps,
} from "react-editable-json-tree";
import {
  array as arrayStyle,
  object as objectStyle,
  value as valueStyle,
} from "react-editable-json-tree/dist/utils/styles";
import styled from "styled-components";
import { jsonColors, StateTreeIndentWidth } from "../../../styles";

export interface Props {
  value: any;
  onDeltaUpdate?: (args: {
    key: string;
    keyPath: string[];
    newValue: any;
    oldValue: any;
  }) => any;
  readOnly?: boolean;
  depth?: number;
}

const StyledJsonTree = styled.div`
  .rejt-name {
    display: inline-block;
    height: 20px;
    cursor: pointer;
  }

  .rejt-not-collapsed-list {
    list-style: none;
    padding-left: 0;
    margin: 0;
    margin-left: ${StateTreeIndentWidth} !important;
  }

  .rejt-tree > .rejt-object-node > span:first-child {
    display: none;
  }
`;

const ButtonContainer = styled.span`
  display: inline-block;
  width: 26px;
  transition: opacity 150ms ease-in-out;
  color: lightgrey;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`;

const getStyle: EditableJsonTreeProps["getStyle"] = (
  _keyName,
  data,
  _keyPath,
  _deep,
  dataType,
) => {
  const typeofColors = {
    string: jsonColors.jsonString,
    boolean: jsonColors.jsonBoolean,
    number: jsonColors.jsonNumber,
  };

  switch (dataType) {
    case "Object":
    case "Error":
      return {
        ...objectStyle,
        name: {
          color: jsonColors.jsonName,
        },
      };
    case "Array":
      return {
        ...arrayStyle,
        name: {
          color: jsonColors.jsonName,
        },
      };
    default:
      return {
        ...valueStyle,
        value: {
          color:
            typeofColors[typeof data as keyof (typeof typeofColors)] ||
            jsonColors.jsonNumber,
        },
        name: {
          color: jsonColors.jsonName,
        },
      };
  }
};

const CancelButton = ({ onClick }: { onClick?: () => any }) => (
  <ButtonContainer onClick={onClick}>
    <FontAwesomeIcon icon={faBan} size="sm" />
  </ButtonContainer>
);

const EditButton = ({ onClick }: { onClick?: () => any }) => (
  <ButtonContainer onClick={onClick}>
    <FontAwesomeIcon icon={faSave} size="sm" />
  </ButtonContainer>
);

const JsonTree = (props: Props) => (
  <StyledJsonTree>
    <EditableJsonTree
      data={props.value}
      cancelButtonElement={<CancelButton />}
      editButtonElement={<EditButton />}
      minusMenuElement={<span />}
      plusMenuElement={<span />}
      isCollapsed={(_keyPath, depth) => depth > (props.depth || 3)}
      onDeltaUpdate={props.onDeltaUpdate}
      rootName=""
      readOnly={props.readOnly}
      getStyle={getStyle}
    />
  </StyledJsonTree>
);

export default JsonTree;
