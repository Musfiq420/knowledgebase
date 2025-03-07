// import React, { useState, useRef } from "react";
// import AceEditor from "react-ace";
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/mode-python";
// import "ace-builds/src-noconflict/theme-monokai";
// import "ace-builds/src-noconflict/ext-language_tools";

// export default function CodeEditorTool({ data, onChange }) {
//   const [code, setCode] = useState(data?.code || `console.log("Hello, world!");`);
//   const editorRef = useRef(null);

//   // Handle code change
//   const handleChange = (newValue) => {
//     setCode(newValue);
//     onChange({ code: newValue });
//   };

//   // Copy code to clipboard
//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(code);
//     alert("Copied to clipboard!");
//   };

//   return (
//     <div style={{ position: "relative", border: "1px solid #333", borderRadius: "5px" }}>
//       <AceEditor
//         ref={editorRef}
//         mode="javascript" // Change this dynamically if needed
//         theme="monokai"
//         value={code}
//         onChange={handleChange}
//         fontSize={14}
//         width="100%"
//         height="200px"
//         readOnly={data.readOnly} // Read-only in preview mode
//         showPrintMargin={false}
//         highlightActiveLine={!data.readOnly}
//         setOptions={{ useWorker: false }}
//       />

//       {/* Copy Button */}
//       <button
//         onClick={copyToClipboard}
//         style={{
//           position: "absolute",
//           top: "5px",
//           right: "10px",
//           background: "#fff",
//           border: "none",
//           padding: "5px 10px",
//           cursor: "pointer",
//           fontSize: "12px",
//           borderRadius: "3px",
//         }}
//       >
//         Copy
//       </button>
//     </div>
//   );
// }

import React, { useState, useRef } from "react";
import AceEditor from "react-ace";

// Import Ace Editor modes (Add more if needed)
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sh";


// Import Ace Editor themes
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-dracula";

import { createRoot } from "react-dom/client";

export default class CodeEditorTool {
  constructor({ data, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      code: data.code || `console.log("Hello, world!");`,
      language: data.language || "javascript",
    };

    this.wrapper = null;
  }

  /**
   * Render the block in the Editor.js UI
   */
  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("code-editor-tool");

    // React Component
    const CodeEditorComponent = () => {
      const [code, setCode] = useState(this.data.code);
      const [language, setLanguage] = useState(this.data.language);
      const editorRef = useRef(null);

      const handleChange = (newValue) => {
        setCode(newValue);
        this.data.code = newValue;
      };

      const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        this.data.language = newLanguage;
      };

      const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        alert("Copied to clipboard!");
      };

      return (
        <div style={{ position: "relative", border: "1px solid lightgray", borderRadius: "5px", marginTop:"10px" }}>
            
            <select
              value={language}
              disabled={this.readOnly}
              onChange={handleLanguageChange}
              style={{
                marginBottom: "5px",
                padding: "5px",
                borderRadius: "5px",
                // border: "1px solid #ccc",
              }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="sh">Shell</option>
            </select>
          

          <AceEditor
            ref={editorRef}
            mode={language}
            theme="dracula"
            value={code}
            onChange={handleChange}
            fontSize={14}
            width="100%"
            // height="200px"
            readOnly={this.readOnly}
            showPrintMargin={false}
            highlightActiveLine={!this.readOnly}
            setOptions={{ useWorker: false }}
            showGutter={false}
          />

          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            style={{
              position: "absolute",
              top: "5px",
              right: "10px",
              background: "#fff",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              fontSize: "12px",
              borderRadius: "3px",
            }}
          >
            Copy
          </button>
        </div>
      );
    };

    // Render React component into wrapper
    const root = createRoot(this.wrapper);
    root.render(<CodeEditorComponent />);

    return this.wrapper;
  }

  /**
   * Extracts block data for saving in Editor.js
   */
  save() {
    return this.data;
  }

  static get isReadOnlySupported() {
    return true;
  }

    static get enableLineBreaks() {
    return true;
  }
  /**
   * Block toolbox settings
   */
  static get toolbox() {
    return {
      title: "Code Editor",
      icon: "💻",
    };
  }
}
