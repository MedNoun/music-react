import Editor from "@monaco-editor/react";

const options = {
  codeLens: false
};

export default function ({ onEditorChange, defaultValue }) {
  return (
    <div className="editor">
      <Editor
        height="100vh"
        defaultLanguage="markdown"
        theme="vs-dark"
        options={options}
        defaultValue={defaultValue}
        onChange={onEditorChange}
      />
    </div>
  );
}
