import WorkspacePicker from "./WorkspacePicker";
import React, {useState, useEffect, useContext} from "react";
import {Header, debugContext, i18nContext, getJson} from "pithekos-lib";

// import {doI18n} from "../../lib/i18n";

function LocalProjects() {
    const [repos, setRepos] = useState([]);
    const debugValue = useContext(debugContext);
    const i18n = useContext(i18nContext);
    const getRepoList = async () => {
        const response = await getJson("/git/list-local-repos", debugValue.debugRef.current);
        if (response.ok) {
            setRepos(response.json);
        }
    }

    useEffect(
        () => {
            getRepoList().then();
        },
        []
    );

    return Object.keys(i18n).length === 0 ?
        <p>...</p> :
        <>
            <Header
                titleKey="pages:core-local-workspace:title"
                requireNet={false}
                currentId="core-local-workspace"
            />
            <WorkspacePicker repos={repos}/>
        </>
}

export default LocalProjects;
