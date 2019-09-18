import { Quote, Trade } from "./types";
import * as React from "react";

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default <T extends Quote | Trade>({
  title,
  data,
  props,
}: {
  title: string;
  data: { [key: string]: T };
  props: (keyof T & string)[],
}) => (
  <table>
    <caption>{capitalize(title)}</caption>
    <tbody>
      <tr>
        {props.map(prop => (
          <th key={prop}>{capitalize(prop)}</th>
        ))}
      </tr>
      {Object.values(data).map(value => (
        <tr key={value.sym}>
          {props.map(prop => (
            <td key={prop}>{value[prop]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
