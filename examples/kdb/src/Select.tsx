import * as React from "react";

export const allSymbols = Object.fromEntries(
  ["BA.N", "GS.N", "IBM.N", "MSFT.O", "VOD.L"].map(name => [name, true]),
);

export default ({
  symbols,
  toggleSymbol,
}: {
  symbols: { [key: string]: boolean };
  toggleSymbol: (name: string) => void;
}) => (
  <div>
    {Object.entries(symbols).map(([name, state]) => (
      <label key={name}>
        <input
          type="checkbox"
          checked={state}
          onChange={() => toggleSymbol(name)}
        />
        {name}
      </label>
    ))}
  </div>
);
