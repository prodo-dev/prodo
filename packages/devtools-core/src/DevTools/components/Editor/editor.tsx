import { debounce } from "lodash";
import * as path from "path-browserify";
import * as React from "react";
import { configureMonaco } from "./configure";
import { setupGrammars } from "./tmgrammer";
import { Dependencies, File } from "./types";

export { File, Dependencies };

export interface Props {
  currentFile: File;
  files: File[];
  onChangeValue: (path: string, value: string) => any;
  dependencies?: Dependencies;
  onOpenPath?: (path: string) => any;
  globalTypes?: string;
  focusOnMount?: boolean;
  editorOptions?: monaco.editor.IEditorConstructionOptions;
  autoHeight?: boolean;
  hidden?: boolean;
}

configureMonaco();
setupGrammars();

const defaultMonacoOptions: monaco.editor.IEditorConstructionOptions = {
  lineNumbers: "on",
  selectOnLineNumbers: true,
  wordWrapColumn: 80,
  useTabStops: false,
  minimap: {
    enabled: false,
  },
  formatOnType: false,
  formatOnPaste: true,
  fontSize: 13,
  fontFamily: '"Source Code Pro", "Menlo", "Consolas", monospace',
  fontWeight: "normal",
  fontLigatures: true,
  fixedOverflowWidgets: true,
  theme: "prodo",
};

// Store details about typings we have loaded
// const extraLibs = new Map();

// Store editor states such as cursor position, selection and scroll
// position for each model
const editorStates = new Map();

class Editor extends React.Component<Props> {
  private node: React.RefObject<HTMLDivElement>;
  private editor: monaco.editor.IStandaloneCodeEditor | undefined;
  private subscription: monaco.IDisposable | undefined;
  private typingsWorker: Worker | undefined;
  private prevLineCount: number = -1;

  private handleResize = debounce(() => {
    if (this.editor != null) {
      this.editor.layout();
    }
  }, 50);

  constructor(props: Props) {
    super(props);

    this.node = React.createRef();
  }

  public componentDidMount() {
    // this.typingsWorker = new Worker("./workers/typings.worker.ts");

    // this.typingsWorker.addEventListener("message", event => {
    //   Object.keys(event.data).forEach((path: string) => {
    //     const typings = event.data[path];

    //     this.addLib(typings, "/" + path);
    //   });
    // });

    // this.typingsWorker.postMessage({
    //   dependencies: this.props.dependencies || {},
    // });

    // if (this.props.globalTypes != null) {
    //   this.addLib(this.props.globalTypes, "global.d.ts");
    // }

    if (this.node.current) {
      this.editor = monaco.editor.create(
        this.node.current,
        this.getMonacoOptions(),
        this.getOverrides(),
      );

      this.props.files.forEach(({ path, value }) =>
        this.initializeFile(path, value),
      );

      const { path, value } = this.props.currentFile;
      this.openFile(path, value);

      if (this.props.autoHeight) {
        // on each edit recomputeHeight
        this.editor.onDidChangeModelDecorations(
          debounce(() => {
            // wait until dom has updated
            setTimeout(this.setEditorHeight, 0);
          }, 10),
        );
      }
    }
  }

  public componentWillUnmount() {
    this.subscription && this.subscription.dispose();
    this.editor && this.editor.dispose();
    this.typingsWorker && this.typingsWorker.terminate();

    window.removeEventListener("resize", this.handleResize);
  }

  public async componentDidUpdate(prevProps: Props) {
    if (this.editor == null) {
      return;
    }

    const editor = this.editor;

    editor.updateOptions(this.getMonacoOptions());
    const { path, value } = this.props.currentFile;

    if (path !== prevProps.currentFile.path) {
      editorStates.set(prevProps.currentFile.path, editor.saveViewState());

      await this.openFile(path, value);
    } else if (
      value.trim() !==
      editor
        .getModel()!
        .getValue()
        .trim()
    ) {
      const model = editor.getModel();

      if (model && value !== model.getValue()) {
        model.pushEditOperations(
          [],
          [{ range: model.getFullModelRange(), text: value }],
          () => null,
        );
      }
    }

    if (this.props.hidden !== prevProps.hidden) {
      setTimeout(this.setEditorHeight, 0);
    }

    this.handleResize();
  }

  public render() {
    return (
      <div
        className="editor"
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          height: "auto",
        }}
        ref={this.node}
      />
    );
  }

  // https://github.com/Microsoft/monaco-editor/issues/794
  private setEditorHeight = () => {
    if (!this.props.autoHeight || this.props.hidden || this.editor == null) {
      return;
    }

    const editor = this.editor;

    const editorDomNode = editor.getDomNode();
    if (!editorDomNode) {
      return;
    }

    const container = editorDomNode.getElementsByClassName(
      "view-lines",
    )[0] as HTMLElement;
    const containerHeight = container.offsetHeight;
    const lineHeight = container.firstChild
      ? (container.firstChild as HTMLElement).offsetHeight
      : 20;

    if (!containerHeight && !this.props.hidden) {
      // dom hasn't finished settling down. wait a bit more.
      setTimeout(this.setEditorHeight, 0);
    } else {
      const currLineCount = container.childElementCount;
      const nextHeight =
        this.prevLineCount > currLineCount
          ? currLineCount * lineHeight
          : containerHeight;

      editorDomNode.style.height = nextHeight + "px";
      setTimeout(() => editor.layout(), 0);

      if (container.childElementCount !== currLineCount) {
        this.setEditorHeight();
      } else {
        this.prevLineCount = currLineCount;
      }
    }
  };

  private getOverrides = () => ({});

  private getMonacoOptions = (): monaco.editor.IEditorConstructionOptions => {
    return {
      ...defaultMonacoOptions,
      ...(this.props.editorOptions || {}),
    };
  };

  private getMode = (filename: string) => {
    const extToModes = {
      json: "json",
    };

    const ext = path.extname(filename).replace(".", "");
    return extToModes[ext] || "typescript";
  };

  private initializeFile = async (path: string, value: string) => {
    let model = monaco.editor
      .getModels()
      .find(model => model.uri.path === path);

    if (model) {
      model.pushEditOperations(
        [],
        [{ range: model.getFullModelRange(), text: value }],
        () => null,
      );
    } else {
      const uri = monaco.Uri.file(path);
      model = monaco.editor.createModel(value, this.getMode(path), uri);

      model.updateOptions({ tabSize: 2, insertSpaces: true });
    }

    window.addEventListener("resize", this.handleResize);
  };

  private openFile = async (path: string, value: string) => {
    if (this.editor == null) {
      return;
    }

    const editor = this.editor;

    await this.initializeFile(path, value);

    const model = monaco.editor
      .getModels()
      .find(model => model.uri.path === path);

    if (!model) {
      return;
    }

    editor.setModel(model);

    const editorState = editorStates.get(path);

    if (editorState) {
      editor.restoreViewState(editorState);
    }

    if (this.props.focusOnMount) {
      editor.focus();
    }

    this.subscription && this.subscription.dispose();
    this.subscription = editor.getModel()!.onDidChangeContent(() => {
      const path = editor.getModel()!.uri.path;
      const value = editor.getModel()!.getValue();
      if (this.props.onChangeValue) {
        this.props.onChangeValue(path, value);
      }
    });
  };

  // private addLib = (code: string, path: string) => {
  //   const fullPath = `file://${path}`;
  //   let extraLib = extraLibs.get(fullPath);

  //   extraLib && extraLib.dispose();
  //   extraLib = monaco.languages.typescript.typescriptDefaults.addExtraLib(
  //     code,
  //     fullPath,
  //   );

  //   extraLibs.set(fullPath, extraLib);

  //   this.commitLibChanges();
  // };

  // private commitLibChanges = () => {
  //   (monaco as any).languages.typescript.typescriptDefaults._onDidChange.fire(
  //     monaco.languages.typescript.typescriptDefaults,
  //   );

  //   monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  //     noSemanticValidation: false,
  //     noSyntaxValidation: false,
  //   });
  // };
}

export default Editor;
