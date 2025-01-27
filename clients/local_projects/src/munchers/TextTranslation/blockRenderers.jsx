import {useState} from "react";
import {InlineRenderer} from "./inlineRenderers";

function ParaRenderer({usj, marker, nPara, selectedPath, setSelectedPath, setUsjNode, selectedFontClass}) {
    return <p
        style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "baseline"
    }}
        className={`usfm-${marker}`}
    >
        { nPara === selectedPath[0] &&
            <span className="para-tool">{marker}</span>
        }
        {
            usj.content &&
            usj.content[nPara] &&
            usj.content[nPara].content &&
            usj.content[nPara].content.map(
                ((e, n) =>
                        <InlineRenderer
                            key={n}
                            element={e}
                            selectedPath={selectedPath}
                            setSelectedPath={setSelectedPath}
                            contentPath={[nPara, n]}
                            usj={usj}
                            setUsjNode={setUsjNode}
                            selectedFontClass={selectedFontClass}
                        />
                )
            )
        }
    </p>;
}


function ChapterRenderer({usj, nPara, selectedPath, setSelectedPath, setUsjNode, selectedFontClass}) {
    const chapterNumber = `${usj.content[nPara]["number"]}`;
    const [editedValue, setEditedValue] = useState(chapterNumber);
    return <p
        style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "baseline"
        }}
        className="bare-text usfm-c"
        onClick={() => setSelectedPath([nPara])}
    >
        { nPara === selectedPath[0] &&
            <span className="para-tool">C</span>
        }
        {
            nPara === selectedPath[0] ?
                <span
                    style={{
                        size: 1
                    }}
                >
                    <input
                        className={`${selectedFontClass} usfm-c`}
                        style={{
                            padding: 0,
                            width: "100%"
                        }}
                        value={editedValue}
                        size="1"
                        onChange={e => setEditedValue(e.target.value)}
                        onBlur={() => (editedValue !== usj.content[nPara].number) && setUsjNode([nPara, "number"], editedValue)}
                        dir="rtl"
                    />
                    <div style={{
                        visibility: "hidden"
                    }}>
                        {editedValue}
                    </div>
                </span>
                :
                chapterNumber
        }
    </p>;
}

export {ParaRenderer, ChapterRenderer};