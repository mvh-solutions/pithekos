import React from 'react';
import {useLocation} from "react-router-dom";
import WorkspaceCard from "./WorkspaceCard";
// import BcvPicker from "./BcvPicker";
import {
    createTilePanes,
    TileContainer,
    TileProvider,
} from 'react-tile-pane'
import {Header} from "pithekos-lib";


const paneStyle = {
    width: '100%',
    height: '100%',
    overflow: 'scroll'
}
const Workspace = () => {
    const locationState = Object.entries(useLocation().state);
    const resources = locationState
        .map(kv => {
            return {...kv[1], local_path: kv[0]}
        })

    const tileElements = {};
    const rootPane = {
        children: [
            null,
            {
                children: [],
                isRow: true
            }
        ],
    }
    for (const resource of resources) {
        const title = resource.name;
        tileElements[title] = <WorkspaceCard
            metadata={resource}
            style={paneStyle}
        />;
        if (resource.primary) {
            rootPane.children[0] = {children: title};
        } else {
            rootPane.children[1].children.push({children: title});
        }
    }
    if (rootPane.children[1].children.length === 0) {
        rootPane.children.pop();
    }
    const paneList = createTilePanes(tileElements)[0];
    return <>
        <Header
            subtitleKey="pages:workspace:subtitle"
            requireNet={false}
        />
        <TileProvider
            tilePanes={paneList}
            rootNode={rootPane}
        >
            <div style={{width: '100vw', height: '100vh'}}>
                <TileContainer/>
            </div>
        </TileProvider>
    </>
}
export default Workspace;
