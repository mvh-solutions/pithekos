import deepEqual from "deep-equal";
import {useState} from "react";

const contentForPath = (content, path) => {
    if (path.length === 0) {
        return content;
    }
    if (typeof path[0] === "number") {
        return contentForPath(
            content["content"][path[0]],
            path.slice(1)
        );
    } else { // attribute of object
        return content[path[0]];
    }
}

function InlineRenderer({usj, element, contentPath, selectedPath, setSelectedPath, setUsjNode, selectedFontClass}) {
    if (typeof element === "string") {
        return <StringRenderer
            selectedPath={selectedPath}
            setSelectedPath={setSelectedPath}
            contentPath={contentPath}
            usj={usj}
            setUsjNode={setUsjNode}
        />
    } else if (element.marker === "v") {
        return <VerseRenderer
            selectedPath={selectedPath}
            setSelectedPath={setSelectedPath}
            contentPath={contentPath}
            usj={usj}
            setUsjNode={setUsjNode}
            selectedFontClass={selectedFontClass}
        />
    } else if (element.type === "ms") {
        return <MilestoneRenderer
            selectedPath={selectedPath}
            setSelectedPath={setSelectedPath}
            contentPath={contentPath}
            usj={usj}
            setUsjNode={setUsjNode}
        />
    } else if (element.type === "char") {
        return <CharRenderer
            selectedPath={selectedPath}
            setSelectedPath={setSelectedPath}
            contentPath={contentPath}
            usj={usj}
            setUsjNode={setUsjNode}
        />
    } else return <span
        className={`usfm-${element.marker}`}
        style={{color: "red"}}
    >
        {
            deepEqual(selectedPath, contentPath) ?
                (element.content || [element]).map(e =>
                    <input
                        value={JSON.stringify(e)}></input>
                ) :
                (element.content || [element]).map(e =>
                    typeof e === "string" ? e : JSON.stringify(e)
                )
        }
    </span>;
}

function VerseRenderer({usj, selectedPath, setSelectedPath, contentPath, setUsjNode, selectedFontClass}) {
    const [editedValue, setEditedValue] = useState(contentForPath(usj, contentPath)["number"]);
    return <span
        className="usfm-v"
        onClick={() => setSelectedPath(contentPath)}
    >
        {
            deepEqual(selectedPath, contentPath) ?
                <>
                    <input
                        className={`${selectedFontClass} usfm-v`}
                        style={{
                            padding: 0,
                            width: "100%"
                        }}
                        value={editedValue}
                        size="1"
                        onChange={e => setEditedValue(e.target.value)}
                        onBlur={() => (editedValue !== contentForPath(usj, contentPath).number) && setUsjNode(contentPath, editedValue)}
                        dir="rtl"
                    />
                    <div style={{
                        visibility: "hidden"
                    }}>
                        {editedValue}
                    </div>
                </>
                :
                <span
                    style={{
                        padding: 0,
                        width: "100%"
                    }}
                >
                {editedValue}
                </span>
        }
    </span>;
}

function MilestoneRenderer({usj, selectedPath, setSelectedPath, contentPath, setUsjNode}) {
    const initialValue = contentForPath(usj, contentPath)
    return <span
        className="usfm-ms"
        onClick={() => setSelectedPath(contentPath)}
    >
{initialValue.marker.endsWith("s") ? `${initialValue.marker}>` : `<${initialValue.marker}`}
    </span>;
}

function CharRenderer({usj, selectedPath, setSelectedPath, contentPath, setUsjNode}) {
    const initialValue = contentForPath(usj, contentPath)
    return <span
        className="usfm-char"
        onClick={() => setSelectedPath(contentPath)}
    >
        {`${initialValue.marker}>`}
        {initialValue.content.join("")}
        {`<${initialValue.marker}`}
    </span>;
}

function StringRenderer({usj, selectedPath, setSelectedPath, contentPath, setUsjNode, selectedFontClass}) {
    const initialValue = contentForPath(usj, contentPath)
    const [editedValue, setEditedValue] = useState(initialValue);
    const paraUsfmName = `usfm-${usj.content[contentPath[0]].marker}`;
    return <span
        className={`bare-text ${selectedFontClass} ${paraUsfmName}`}
        style={{
            display: "inline-block",
            size: 1
        }}
        onClick={() => setSelectedPath(contentPath)}
    >
        {
            deepEqual(selectedPath, contentPath) ?
                <>
                    <input
                        className={`${selectedFontClass} ${paraUsfmName}`}
                        style={{
                            padding: 0,
                            width: "100%"
                        }}
                        value={editedValue}
                        size="1"
                        onChange={e => setEditedValue(e.target.value)}
                        onBlur={() => (editedValue !== contentForPath(usj, contentPath)) && setUsjNode(contentPath, editedValue)}
                        dir="rtl"
                    />
                    <div style={{
                        visibility: "hidden"
                    }}>
                        {editedValue}
                    </div>
                </>
                :
                <span
                    style={{
                        padding: 0,
                        width: "100%"
                    }}
                >
                {editedValue}
                </span>
        }
    </span>;
}

export {InlineRenderer, VerseRenderer, StringRenderer, MilestoneRenderer};