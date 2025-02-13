import React from "react";
import ReactDOM from "react-dom";
import MonacoEditorBlock from "./MonacoEditorBlock";

export default class MonacoEditorTool {
  static get toolbox() {
    return {
      title: "Code Editor",
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c19 0 34-15 34-34v-31zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  constructor({ data, readOnly }) {
    this.data = data || { code: "", language: "javascript" };
    this.readOnly = readOnly;
    this.editorInstance = null; // Store the Monaco Editor instance
  }

  render() {
    const wrapper = document.createElement("div");
    ReactDOM.render(
      <MonacoEditorBlock
        data={this.data}
        readOnly={this.readOnly}
        onEditorReady={(editor) => {
          this.editorInstance = editor; // Store the editor instance
        }}
        onLanguageChange={(language) => {
          
          this.data.language = language; // Update the selected language
          if (this.editorInstance) {
            
            this.editorInstance.updateOptions({ language }); // Update the editor language
          }
        }}
      />,
      wrapper
    );
    return wrapper;
  }

  save() {
    if (this.editorInstance) {
      const code = this.editorInstance.getValue(); // Get the full code from the editor instance
      return {
        code: code,
        language: this.data.language || "javascript", // Use the selected language
      };
    }
    return {
      code: "",
      language: "javascript",
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get enableLineBreaks() {
    return true;
  }
}