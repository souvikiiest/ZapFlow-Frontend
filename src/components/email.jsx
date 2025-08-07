
import { useEffect, useRef, useState } from "react";
import { flattenObject } from "../utils/helpers";


export default function Email({ onChange, initialMetadata, parentAction}) {
    initialMetadata = initialMetadata || { to: '', body: '' };
    const [to, setTo] = useState(parentAction.metadata.to ?? '');
    const [body, setBody] = useState(parentAction.metadata.body ?? '');
    const inputRefs = {
        to: useRef(null),
        body: useRef(null),
    };
    const [activeField, setActiveField] = useState(null);


    useEffect(() => {
        const handler = setTimeout(() => {
            onChange({ to, body });
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [to, body, onChange]);

    function insertText(activeField, text) {
        const input = inputRefs[activeField].current;
        if (!input) return;

        const start = input.selectionStart;
        const end = input.selectionEnd;
        const value = input.value;
        
        const updatedValue = value.slice(0, start) + text + value.slice(end);
        activeField == "to" ? setTo(updatedValue) : setBody(updatedValue);

        requestAnimationFrame(() => {
            input.setSelectionRange(start + text.length, start + text.length);
            input.focus();
        });

    }
    function renderHighlighted(text, metadata) {
        const regex = /\{\{data\.([\w.]+?)\}\}/g;

        const elements = [];
        let lastIndex = 0;
        let match;
        let key = 0;

        while ((match = regex.exec(text)) !== null) {
            const start = match.index;
            const end = regex.lastIndex;

            if (start > lastIndex) {
                elements.push(<span key={key++}>{text.slice(lastIndex, start)}</span>);
            }

            const dataKey = match[1];
            const value = metadata?.[dataKey] ?? `{{data.${dataKey}}}`;

            elements.push(
                <span key={key++} className="bg-green-100 text-green-800 px-1 rounded">
                    {value}
                </span>
            );
            lastIndex = end;
        }
        if (lastIndex < text.length) {
            elements.push(<span key={key++}>{text.slice(lastIndex)}</span>);
        }
        return elements;
    }




    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="email-to" className="block text-sm font-medium text-slate-600 mb-1">
                    To
                </label>
                <textarea
                    id="email-to"
                    type="email"
                    value={to}
                    rows={1}
                    ref={inputRefs.to}
                    onFocus={(e) => setActiveField("to")}
                    placeholder="recipient@example.com"
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                />
                <div className="w-full p-3 border border-dashed rounded-lg text-sm bg-gray-50 whitespace-pre-wrap font-mono">
                    Preview: {renderHighlighted(to, initialMetadata)}
                </div>
            </div>
            <div>
                <label htmlFor="email-body" className="block text-sm font-medium text-slate-600 mb-1">
                    Body
                </label>
                <textarea
                    id="email-body"
                    value={body}
                    ref={inputRefs.body}
                    onFocus={(e) => setActiveField("body")}
                    placeholder="Compose your email..."
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                    className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                />
                <div className="w-full p-3 border border-dashed rounded-lg text-sm bg-gray-50 whitespace-pre-wrap font-mono">
                    Preview: {renderHighlighted(body, flattenObject(initialMetadata))}
                </div>
            </div>
            {/* Metadata button */}
            <p className="block text-sm font-large text-black-600 mb-1">Click to Insert</p>
            <div className="flex flex-wrap gap-2 pt-2">

                {initialMetadata && (
                    Object.keys(flattenObject(initialMetadata)).map((key)=>(
                        <button
                            onClick={() => insertText(activeField, `{{data.${key}}}`)}
                            key={key}
                            className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 border rounded"
                        >{key}</button>
                    ))
                )}
            </div>

        </div>
    );
}