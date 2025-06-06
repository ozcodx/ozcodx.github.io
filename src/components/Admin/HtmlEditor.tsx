import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './HtmlEditor.scss';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  height?: string;
  simple?: boolean; // Nueva prop para modo simple
}

export const HtmlEditor = ({ 
  value, 
  onChange, 
  placeholder = "Escribe tu contenido aquí...", 
  disabled = false,
  height = "300px",
  simple = false
}: HtmlEditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  // Configuración de toolbar simple para resúmenes
  const simpleToolbar = [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ];

  // Configuración de toolbar completa para contenido
  const fullToolbar = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    ['clean']
  ];

  // Configuración de módulos para Quill
  const modules = {
    toolbar: simple ? simpleToolbar : fullToolbar,
    clipboard: {
      matchVisual: false,
    }
  };

  // Formatos para modo simple
  const simpleFormats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  // Formatos completos
  const fullFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'link', 'image', 'video',
    'blockquote', 'code-block'
  ];

  // Formatos permitidos según el modo
  const formats = simple ? simpleFormats : fullFormats;

  useEffect(() => {
    // Configurar altura del editor
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const editorContainer = editor.container.querySelector('.ql-editor') as HTMLElement;
      if (editorContainer) {
        editorContainer.style.minHeight = height;
      }
    }
  }, [height]);

  return (
    <div className={`html-editor ${simple ? 'simple' : ''}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
      />
    </div>
  );
}; 