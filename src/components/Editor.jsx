import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Table from '@editorjs/table';
import LinkTool from '@editorjs/link';
import './editor.css';
import LinkPreviewTool from './LinkPreview';
import MonacoEditorTool from './blocks/MonacoEditorTool.jsx';
import CodeEditorBlock from "./blocks/CodeMirrorTool.jsx";

const fetchLinkPreview = async (url) => {
  try {
    console.log(url);
    const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.status === "success") {
      return {
        success: 1,
        link: url,
        meta: {
          title: data.data.title || "No title available",
          description: data.data.description || "",
          image: {
            url: data.data.image?.url || ""
          }
        }
      };
    } else {
      return { success: 0 };
    }
  } catch (error) {
    console.error("Microlink fetch error:", error);
    return { success: 0 };
  }
};

const tools = {
  header: {
    class: Header,
    config: {
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 2
    }
  },
  list: {
    class: List,
    inlineToolbar: true
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile(file) {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                success: 1,
                file: {
                  url: e.target.result
                }
              });
            };
            reader.readAsDataURL(file);
          });
        },
        uploadByUrl(url) {
          return new Promise((resolve) => {
            resolve({
              success: 1,
              file: {
                url: url,
              },
            });
          });
        },
      }
    }
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: 'Quote author'
    }
  },
  code: {class: CodeEditorBlock}, // Use the new Monaco Editor tool
  // delimiter: {
  //   class: Delimiter,
  // },
  // {
  //   class: Code,
  //   config: {
  //     placeholder: 'Enter your code here...'
  //   }
  // },
  delimiter: {
    class: Delimiter
  },
  marker: {
    class: Marker,
    shortcut: 'CMD+SHIFT+M'
  },
  inlineCode: {
    class: InlineCode,
    shortcut: 'CMD+SHIFT+C'
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3
    }
  },
  linkPreview: {
    class: LinkPreviewTool,
  },
};

function Editor({ data, onChange, readOnly = false }) {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    if (!editorInstance.current) {
      const editor = new EditorJS({
        holder: editorRef.current,
        tools: tools,
        data: data || {},
        readOnly,
        onChange: async () => {
          const content = await editor.save();
          onChange?.(content);
        },
        onReady: () => {
          const editorElement = editorRef.current;
let lastTyped = ""; // To track the last two characters

editorElement.addEventListener("input", (event) => {
  lastTyped += event.data || ""; // Get the last typed character

  if (lastTyped.endsWith(">>")) {
    event.preventDefault(); // Prevent default input behavior

    console.log("cli");

    // Get selection and range
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Move range back 2 characters to delete '>>'
      range.setStart(range.startContainer, range.startOffset - 2);
      range.deleteContents();

      // Insert a line break
      const br = document.createElement("br");
      range.insertNode(br);

      // Create another <br> to mimic Enter key behavior
      const secondBr = document.createElement("br");
      range.insertNode(secondBr);

      // Move cursor after the new line
      range.setStartAfter(secondBr);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    lastTyped = ""; // Reset tracker
  } else if (lastTyped.length > 2) {
    lastTyped = lastTyped.slice(-2); // Keep only the last two characters
  }
});




        }
      });

      editorInstance.current = editor;
    }

    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [readOnly]);

  // useEffect(() => {
  //   if (editorInstance.current && editorInstance.current.isReady && data) {
  //     editorInstance.current.isReady
  //       .then(() => {
  //         editorInstance.current.render(data);
  //       })
  //       .catch((error) => {
  //         console.error('Failed to update Editor.js data:', error);
  //       });
  //   }
  // }, [data]);

  return <div id="editorjs" ref={editorRef} className="prose max-w-none" />;
}

export default Editor;
