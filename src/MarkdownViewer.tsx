import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';
import 'katex/dist/katex.min.css';

const { BlockMath, InlineMath } = require("react-katex");
const emoji = require("emoji-dictionary");
const gfm = require("remark-gfm");

interface MarkdownViewerProps {
    source: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = (props: MarkdownViewerProps) => {
	const newProps = {
		escapeHtml: false,
		plugins: [
			RemarkMathPlugin,
            gfm // Table 지원
		],

		renderers: {
            /* 각 element에 대한 렌더링 방식을 정의할 것. */
            /* 아래에서 정의하지 않은 element는 ReactMarkdown의 기본 방식을 따름. */
			text: (props: any) => props.value.replace(/:[^:\s]*(?:::[^:\s]*)*:/gi, (name: string) => emoji.getUnicode(name)),
			break: (props: any) => <br></br>,
			paragraph: (props: any) => <p className="markdown_paragraph">{props.children}</p>,
			emphasis: (props: any) => <em className="markdown_emphasis">{props.children}</em>,
			link: (props: any) => props.href ? <a className="markdown_link" href={props.href}>{props.children}</a> : <strong className="markdown_strong">(주소가 없는 링크는 만들 수 없습니다.)</strong>,
			linkReference: (props: any) => props.href ? <a className="markdown_link" href={props.href}>{props.children}</a> : <strong className="markdown_strong">(주소가 없는 링크는 만들 수 없습니다.)</strong>,
			strong: (props: any) => <strong className="markdown_strong">{props.children}</strong>,
			delete: (props: any) => <del>{props.children}</del>,
			list: (props: any) => props.start ? <ol className="markdown_ol">{props.children}</ol> : <ul className="markdown_ul">{props.children}</ul>,
			listItem: (props: any) => <li className="markdown_list_item">{props.children}</li>,
			blockquote: (props: any) => (
				<blockquote className="markdown_blockquote">
					{props.children}
				</blockquote>),
			code: (props: any) => (
				<pre className="markdown_pre">
					<code>
						{props.value}
					</code>
				</pre>),
			table: (props: any) => (
				<table className="markdown_table">{props.children}</table>
			),
			tableCell: (props: any) => {
				let style: any = {
					textAlign: props.align ? props.align : 'center',
					padding: "6px 13px"
				};

				style.border = '1px solid #dfe2e5';
				if (props.isHeader) {
					style.background = '#f2f2f2'   
				}

				return <td style={style}>{props.children}</td>
			},
			inlineCode: (props: any) => <code className="markdown_inline_code">{props.value}</code>,
			math: (props: any) => <BlockMath>{props.value}</BlockMath>,
			inlineMath: (props: any) => <InlineMath>{props.value}</InlineMath>,
			html: (props: any) => <strong className="markdown_strong">(HTML 태그는 사용할 수 없습니다.)</strong>
		}
	};

	return (
		<ReactMarkdown className="markdown_viewer" {...props} {...newProps}></ReactMarkdown>
	);
};

export default MarkdownViewer;