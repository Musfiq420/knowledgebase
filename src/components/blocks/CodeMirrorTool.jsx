// import React, { useEffect, useRef, useState } from "react";
// import { Controlled as CodeMirror } from "react-codemirror2";
// import "codemirror/lib/codemirror.css";
// import "codemirror/mode/javascript/javascript";
// import "codemirror/mode/python/python";
// import "codemirror/theme/dracula.css";
// import "codemirror/theme/material.css";
// import { createRoot } from "react-dom/client";

// const languages = {
//   javascript: "javascript",
//   python: "python",
// };

// export default class CodeEditorBlock {
//   static get toolbox() {
//     return {
//       title: "Code Editor",
//       icon: "🖥️",
//     };
//   }

//   constructor({ data, api }) {
//     this.api = api;
//     this.data = data || { code: "", language: "javascript" };
//     this.wrapper = null;
//   }

//   render() {
//     this.wrapper = document.createElement("div");
//     this.wrapper.classList.add("code-editor-wrapper");
  
//     const CodeEditor = () => {
//       const [code, setCode] = useState(this.data.code);
  
//       useEffect(() => {
//         this.data.code = code;
//       }, [code]);
  
//       return (
//         <CodeMirror
//           value={code}
//           options={{
//             mode: "javascript",
//             theme: "dracula",
//             lineNumbers: true,
//             tabSize: 2,
//           }}
//           onBeforeChange={(_, __, value) => setCode(value)}
//           editorDidMount={(editor) => {
//             // Prevent Editor.js from handling Backspace & Enter inside CodeMirror
//             editor.on("keydown", (cm, event) => {
//               event.stopPropagation(); // Stops Editor.js from listening
//             });
//           }}
//         />
//       );
//     };
  
//     // Render React Component inside the Editor.js block
//     const root = createRoot(this.wrapper);
//     root.render(<CodeEditor />);
  
//     return this.wrapper;
//   }
  

//   save() {
//     return this.data;
//   }

//   static get isReadOnlySupported() {
//     return true;
//   }

//   static get enableLineBreaks() {
//     return true;
//   }

//   renderReadOnly() {
//     const readOnlyWrapper = document.createElement("pre");
//     readOnlyWrapper.classList.add("read-only-code");
//     readOnlyWrapper.textContent = this.data.code;
//     return readOnlyWrapper;
//   }
// }






import React, { useEffect, useRef, useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode//shell/shell";
import "codemirror/theme/dracula.css";
import "codemirror/theme/material.css";
import { createRoot } from "react-dom/client";

const languages = {
  javascript: "javascript",
  python: "python",
  shell: "shell",
};

export default class CodeEditorBlock {
  static get toolbox() {
    return {
      title: "Code Editor",
      icon: "🖥️",
    };
  }

  constructor({ data, api, readOnly }) {
    this.api = api;
    this.data = data || { code: "", language: "javascript" };
    this.wrapper = null;
    this.readOnly = readOnly;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("code-editor-wrapper");

    // React Component for CodeMirror
    const CodeEditor = () => {
      const [code, setCode] = useState(this.data.code);
      const [language, setLanguage] = useState(this.data.language);
      const editorRef = useRef(null);

      // Handle Copy Button
      const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        alert("Copied to clipboard!");
      };

      useEffect(() => {
        this.data.code = code;
        this.data.language = language;
      }, [code, language]);

      return (
        <div>
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {Object.keys(languages).map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Copy Button */}
          <button onClick={copyToClipboard}>📋 Copy</button>

          {/* CodeMirror Editor */}
          <CodeMirror
            ref={editorRef}
            value={code}
            options={{
              mode: language,
              theme: "dracula",
              lineNumbers: true,
              tabSize: 2,
              readOnly: this.readOnly
            }}
            onBeforeChange={(_, __, value) => setCode(value)}
            editorDidMount={(editor) => {
                // Prevent Editor.js from handling Backspace & Enter inside CodeMirror
                editor.on("keydown", (cm, event) => {
                  event.stopPropagation(); // Stops Editor.js from listening
                });
              }}
          />
        </div>
      );
    };

    // Render React Component in Editor.js
    this.wrapper.appendChild(document.createElement("div"));
    // Render React Component inside the Editor.js block
    const root = createRoot(this.wrapper);
    root.render(<CodeEditor />);

    return this.wrapper;
  }

  save() {
    return this.data;
  }

  static get isReadOnlySupported() {
    return true;
  }

  renderReadOnly() {
    const readOnlyWrapper = document.createElement("pre");
    readOnlyWrapper.classList.add("read-only-code");
    readOnlyWrapper.textContent = this.data.code;
    return readOnlyWrapper;
  }
}
