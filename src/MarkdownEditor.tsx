import React, { useEffect, useState, useRef } from 'react';
import { Paper, Grid, Typography, Divider } from '@material-ui/core';
import MarkdownViewer from './MarkdownViewer';
import AceEditor from 'react-ace';
import AceBuild from "ace-builds";

import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

class MarkDownWithLaTeXRules
    extends window.ace.require("ace/mode/markdown_highlight_rules").MarkdownHighlightRules {
    constructor() {
        super();
        //console.log(this.$rules)
        let LatexHighlightRules = window.ace.require("ace/mode/latex_highlight_rules").LatexHighlightRules;
        let latexRules = (new LatexHighlightRules()).getRules();
        //console.log(latexRules);

        this.$rules.start.push({
            token: "keyword",
            regex: "\\$\\$",
            next: "latex-start"
        });
        this.$rules.start.push({
            token: "keyword",
            regex: "\\$",
            next: "latex-start"
        });
        
        this.embedRules(latexRules, "latex-", [
            {
                token: "keyword",
                regex: "\\$\\$",
                next: "start"
            },
            {
                token: "keyword",
                regex: "\\$",
                next: "start"
            }
        ]);

    }
}

class CustomMarkdownMode
    extends window.ace.require("ace/mode/markdown").Mode {
    constructor() {
        super();
        this.HighlightRules = MarkDownWithLaTeXRules;
    }
}

interface MarkdownEditorProps {
    contents: string;
    onChange: React.Dispatch<string>;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ contents, onChange }) => {
    const [source, setSource] = useState<string>("");
    const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
    const editorDivRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<AceEditor>(null);
    const viewerRef = useRef<HTMLDivElement>(null);

    function updateSource() {
        if (editorRef.current) {
            let session = editorRef.current.editor.getSession();
            setSource(session.getValue());
        } else if (timer !== undefined) {
            clearInterval(timer);
        }
    }

    useEffect(() => {
        const customMarkDown = new CustomMarkdownMode();

        if (editorRef !== undefined && viewerRef !== undefined) {
            let session = editorRef?.current?.editor?.getSession();

            if (session !== undefined) {
                session.setMode(customMarkDown as AceBuild.Ace.SyntaxMode);
                if (viewerRef.current && editorDivRef.current)
                    viewerRef.current.style.height = `${editorDivRef.current.offsetHeight}px`;
                setTimer(setInterval(updateSource, 250));
            }
        }
    }, []);

    useEffect(() => {
        setSource(contents === undefined ? "" : contents);

        if (editorRef !== undefined && viewerRef !== undefined) {
            let session = editorRef?.current?.editor?.getSession();

            if (session !== undefined) {
                session.setValue(contents === undefined ? "" : contents);
            }
        }
    }, [contents]);

    function handleTextChange(value: string): void {
        if (onChange)
            onChange(value);
    }

    return (
        <Paper component="form" className="editor_root">
            <Grid container direction="row" justify="center">
                <div className="editor_input_container">
                    <Typography variant="caption">Markdown 및 LaTeX 형식</Typography>
                    <Divider className="editor_caption_divider" orientation="horizontal"></Divider>
                    <div className="editor_input" ref={editorDivRef}>
                        <AceEditor
                            ref={editorRef}
                            className="editor_input"
                            mode="markdown"
                            theme="textmate"
                            fontSize={18}
                            showPrintMargin={false}
                            minLines={35}
                            maxLines={35}
                            showGutter={true}
                            highlightActiveLine={true}
                            wrapEnabled={true}
                            onChange={handleTextChange}
                        ></AceEditor>
                    </div>
                </div>
                <Divider className="editor_divider" orientation="vertical" flexItem></Divider>
                <div className="editor_viewer_container">
                    <Typography variant="caption">미리 보기</Typography>
                    <Divider className="editor_caption_divider" orientation="horizontal"></Divider>
                    <div ref={viewerRef} className="editor_viewer">
                        <MarkdownViewer source={source}/>
                    </div>
                </div>
            </Grid>
        </Paper>
    );
};

export default MarkdownEditor;