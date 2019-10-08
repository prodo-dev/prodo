import * as React from "react";

export default ({
  changeN,
  changeNSync,
}: {
  changeN: (fraction: number, count: number) => void;
  changeNSync: (fraction: number, count: number) => void;
}) => {
  const [percentage, setPercentage] = React.useState(0.5);
  const [count, setCount] = React.useState(1);
  const [sync, setSync] = React.useState(false);

  return (
    <form>
      <label>
        Sync
        <input
          type="checkbox"
          checked={sync}
          onChange={e => {
            setSync(e.target.checked);
          }}
        />
      </label>
      <label>
        Fraction modified:
        <input
          type="number"
          min="0"
          max="2"
          step="0.01"
          value={percentage}
          onChange={e => {
            setPercentage(parseFloat(e.target.value));
          }}
        />
      </label>
      <label>
        Repeats:
        <input
          type="number"
          min="0"
          step="1"
          value={count}
          onChange={e => setCount(parseInt(e.target.value, 10))}
        />
      </label>
      <input
        type="submit"
        onClick={e => {
          e.preventDefault();
          (sync ? changeNSync : changeN)(1 - percentage, count);
        }}
        value="change"
      />
    </form>
  );
};
