import * as monaco from 'monaco-editor';

// Fix worker loading
self.MonacoEnvironment = {
  getWorker: function (_, label) {
    let workerUrl = '';

    if (label === 'json') workerUrl = 'https://unpkg.com/monaco-editor@latest/min/vs/language/json/json.worker.js';
    else if (label === 'javascript' || label === 'typescript') workerUrl = 'https://unpkg.com/monaco-editor@latest/min/vs/language/typescript/ts.worker.js';
    else if (label === 'css' || label === 'scss' || label === 'less') workerUrl = 'https://unpkg.com/monaco-editor@latest/min/vs/language/css/css.worker.js';
    else if (label === 'html' || label === 'xml') workerUrl = 'https://unpkg.com/monaco-editor@latest/min/vs/language/html/html.worker.js';
    else if (label === 'python') workerUrl = 'https://unpkg.com/monaco-editor@latest/min/vs/language/python/python.worker.js';
    else workerUrl = 'https://unpkg.com/monaco-editor@latest/min/vs/editor/editor.worker.js';

    return new Worker(workerUrl, { type: 'module' });
  }
};



class CodeEditorTool {
  constructor({ data, api, readOnly }) {
    this.api = api;
    this.data = data || { code: '', language: 'javascript' };
    this.readOnly = readOnly;
    this.wrapper = null;
  }

  render() {

    const copyButton = document.createElement('button');
    copyButton.innerText = 'Copy';
    copyButton.style.position = 'absolute';
    copyButton.style.top = '5px';
    copyButton.style.right = '5px';
    copyButton.style.background = '#007bff';
    copyButton.style.color = '#fff';
    copyButton.style.border = 'none';
    copyButton.style.padding = '5px 10px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.borderRadius = '4px';
    copyButton.style.zIndex = 100;
    
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(this.data.code);
      copyButton.innerText = 'Copied!';
      setTimeout(() => (copyButton.innerText = 'Copy'), 2000);
    });

    this.wrapper = document.createElement('div');
    this.wrapper.style.position = 'relative';
    this.wrapper.style.border = '1px solid #ddd';
    this.wrapper.style.borderRadius = '4px';
    this.wrapper.style.overflow = 'hidden';
    this.wrapper.style.height = '300px';

    this.editorContainer = document.createElement('div');
    this.editorContainer.style.height = '100%';
    this.wrapper.appendChild(this.editorContainer);
    this.wrapper.appendChild(copyButton)

    this.editor = monaco.editor.create(this.editorContainer, {
      value: this.data.code,
      language: this.data.language,
      theme: 'vs-dark',
      automaticLayout: true,
      readOnly: this.readOnly,
    });

    return this.wrapper;
  }

  save() {
    return {
      code: this.editor ? this.editor.getValue() : this.data.code,
      language: this.data.language,
    };
  }

  static get toolbox() {
    return {
      title: 'Code',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M9.4 16.6 3.8 12l5.6-4.6 1.3 1.6-3.8 3 3.8 3-1.3 1.6m5.2 0-1.3-1.6 3.8-3-3.8-3 1.3-1.6 5.6 4.6-5.6 4.6Z"/></svg>'
    };
  }


  static get isReadOnlySupported() {
    return true;
  }
}

export default CodeEditorTool;
