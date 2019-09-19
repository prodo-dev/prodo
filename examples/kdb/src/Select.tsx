import * as React from "react";

export const allSymbols = Object.fromEntries(
  ["BA.N", "GS.N", "IBM.N", "MSFT.O", "VOD.L"].map(name => [name, true])
)

export default ({
  symbols,
  toggleSymbol,
}: {
  symbols: {[key: string]: boolean};
  toggleSymbol: (name: string) => void;
}) => (
  <div>
    {Object.keys(allSymbols).map(name => (
      <label key={name}>
        <input
          type="checkbox"
          checked={symbols[name]}
          onChange={() => toggleSymbol(name)}
        />
        {name}
      </label>
    ))}
  </div>
);
