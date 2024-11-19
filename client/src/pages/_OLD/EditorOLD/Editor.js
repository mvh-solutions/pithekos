import Header from "../../../components/Header";
import LexicalEditor from '../../../components/LexicalEditor/LexicalEditor';
import './Editor.css';
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

async function getData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Response status: ${response.status}\n${response}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
}

function Editor() {
    const format = 'as-usj';
    const params = useParams();
    console.log(params);
    const fullLink = `/git/ingredient/${format}/${params["*"]}?ipath=TIT.usfm`;
    console.log('fullLink ==', fullLink);

    const defaultScrRef = {
        bookCode: 'TIT',
        chapterNum: 1,
        verseNum: 1,
    };
    const [navRef, setNavRef] = useState();
    const [usjInput, setUsjInput] = useState();
    const [metadata, setMetadata] = useState();
    // const [cards, setCards] = useState([]);
    // const [books, setBooks] = useState([{code: 'TIT', name: 'Titus'}]);
    const handleUsjChange = (aUsj) => {
        console.log('typed!', aUsj);
        setUsjInput(aUsj);
    };

    useEffect(
        () => {
            const usfmLink = `/git/ingredient/${format}/${params["*"]}?ipath=TIT.usfm`;
            const metadataLink = `/git/metadata/summary/${params["*"]}`;
            getData(usfmLink).then(res => {
                setUsjInput(res);
                console.log("Got USFM\n", res);
            });
            getData(metadataLink).then(res => {
                setMetadata(res);
                console.log("Got Metadata\n", res);
            });
        },
        []
    );

    const [scrRef, setScrRef] = useState(defaultScrRef);

    const props = {
        selectedFont: 'AwamiNastaliqRW',
        fontSize: 15,
        textDirection: 'rtl',
        usjInput,
        onUsjChange: handleUsjChange,
        setNavRef,
        scrRef,
        setScrRef,
        bookId: 'TIT',
        setUsjInput
    };

    return (
        <div className="editor">
            <Header isHome={false}/>
            {metadata && <><h1>{metadata.name}</h1><h2>{metadata.description}</h2></>}
            <div className="editor-body">
                <LexicalEditor {...props} />
            </div>
        </div>
    );
}

export default Editor;
