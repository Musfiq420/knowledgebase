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
import './editor.css';

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
        }
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
  code: {
    class: Code,
    config: {
      placeholder: 'Enter your code here...'
    }
  },
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
  }
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

  return <div ref={editorRef} className="prose max-w-none" />;
}

export default Editor;
