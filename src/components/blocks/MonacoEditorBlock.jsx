import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const LanguageSelector = ({ language, onLanguageChange, readOnly }) => {
  return (
    <select
      value={language} // Ensure the value is controlled
      onChange={(e) => onLanguageChange(e.target.value)}
      disabled={readOnly}
    >
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
      <option value="java">Java</option>
      <option value="html">HTML</option>
      <option value="css">CSS</option>
      <option value="typescript">TypeScript</option>
    </select>
  );
};

const MonacoEditorBlock = ({ data, readOnly, onEditorReady, onLanguageChange }) => {
  const editorRef = useRef(null);
  const [lang, setLang] = useState(data.language || "javascript");

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    onEditorReady(editor);
  };

  // Update the language when the dropdown changes
  const handleLanguageChange = (newLanguage) => {
    setLang(newLanguage); // Update state
    onLanguageChange(newLanguage); // Notify parent
  };

  return (
    <div style={{ position: "relative", margin: "16px 0" }}>
      <div style={{ marginBottom: 8 }}>
        <LanguageSelector
          language={lang}
          onLanguageChange={handleLanguageChange}
          readOnly={readOnly}
        />
      </div>
      <Editor
        key={lang} // Force re-render when language changes
        height="300px"
        width="100%"
        language={lang}
        theme="vs-dark"
        value={data.code || ""}
        options={{
          readOnly: readOnly,
          minimap: { enabled: false },
          fontSize: 14,
        }}
        onMount={handleEditorDidMount}
      />
      {readOnly && (
        <div style={{ position: "absolute", top: 50, right: 10 }}>
          <CopyToClipboard text={data.code || ""}>
            <div className="bg-indigo-600 text-white p-1 rounded cursor-pointer">Copy</div>
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
};

export default MonacoEditorBlock;
