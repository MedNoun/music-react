import React from "react";
import Preview from "./Preview";

const defaultValue = `# Hello

Let's talk about this riff:

\`\`\`abc
X: 1
M: 4/4
K: Am
|Acea|[^Gb],ecb|[Gc']ecc'|[^F^f]dA^f|[eF]cAc-|cecA|[B,GB][A,Ac][A,Ac]4|
\`\`\``;

export default function Sheet() {
  const [value, setValue] = React.useState(defaultValue);
  const [isPlaying, setPlaying] = React.useState(false);

  function onEvent(event) {
    return;
  }

  function play() {
    setPlaying(!isPlaying);
  }

  return (
    <div className="App">
      <div className="preview-wrapper">
        <Preview value={value} onEvent={onEvent} isPlaying={isPlaying} />
        <footer>
          <button onClick={play}>Play</button>
        </footer>
      </div>
    </div>
  );
}
