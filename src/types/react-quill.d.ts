declare module 'react-quill' {
  import { Component } from 'react';

  export interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    theme?: string;
    modules?: any;
    formats?: string[];
    bounds?: string | HTMLElement;
    debug?: string | boolean;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    tabIndex?: number;
    onChange?: (content: string, delta: any, source: string, editor: any) => void;
    onChangeSelection?: (selection: any, source: string, editor: any) => void;
    onFocus?: (selection: any, source: string, editor: any) => void;
    onBlur?: (previousSelection: any, source: string, editor: any) => void;
    onKeyPress?: React.EventHandler<any>;
    onKeyDown?: React.EventHandler<any>;
    onKeyUp?: React.EventHandler<any>;
    preserveWhitespace?: boolean;
  }

  export default class ReactQuill extends Component<ReactQuillProps> {
    getEditor(): any;
    getEditingArea(): HTMLElement;
    focus(): void;
    blur(): void;
  }
} 