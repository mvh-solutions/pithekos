import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import WorkspaceCard from "./WorkspaceCard";
import BcvPicker from "./BcvPicker";
import ArrowBack from "@mui/icons-material/ArrowBack";
import {
    createTilePanes,
    TileContainer,
    TileProvider,
} from 'react-tile-pane'
import {Header} from "pithekos-lib";
import {IconButton} from "@mui/material";
import PithekosToolbar from "../../components/PithekosToolbar";

const paneStyle = {
    width: '100%',
    height: '100%',
    overflow: 'scroll'
}

const BackToProjects = () => {
    const navigate = useNavigate();
    return <IconButton
        sx={{"color": "#FFF"}}
        onClick={
            (e) => {
                navigate("/");
                e.stopPropagation();
            }
        }
    >
        <ArrowBack/>
    </IconButton>

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
    const [selectedHebrewFontClass, setSelectedHebrewFontClass] = useState('Pankosmia-EzraSIL');
    const [selectedMyanmarFontClass, setSelectedMyanmarFontClass] = useState('Pankosmia-Padauk');
    const [selectedArabicUrduFontClass, setSelectedArabicUrduFontClass] = useState('Pankosmia-AwamiNastaliqPankosmia-NotoNastaliqUrdu');
    const [selectedOtherFontClass, setSelectedOtherFontClass] = useState('');
    const [selectedFallbackFontClass, setSelectedFallbackFontClass] = useState('Pankosmia-GentiumPlus');
    const [selectedFontClass, setSelectedFontClass] = useState('fonts-Pankosmia-EzraSILPankosmia-PadaukPankosmia-AwamiNastaliqPankosmia-NotoNastaliqUrduPankosmia-GentiumPlus')

    const pithekosToolbarProps = {
      selectedFontClass,
      setSelectedFontClass,
      selectedHebrewFontClass,
      setSelectedHebrewFontClass,
      selectedMyanmarFontClass,
      setSelectedMyanmarFontClass,
      selectedArabicUrduFontClass,
      setSelectedArabicUrduFontClass,
      selectedOtherFontClass,
      setSelectedOtherFontClass,
      selectedFallbackFontClass,
      setSelectedFallbackFontClass,
    };
    return <>
        <Header
            titleKey="pages:core-local-workspace:title"
            requireNet={false}
            currentId="core-local-workspace"
            widget={<><BackToProjects/><BcvPicker/></>}
        />
        <PithekosToolbar key="pithekos toolbar" {...pithekosToolbarProps} />
        <div className={selectedFontClass}>
          <TileProvider
              tilePanes={paneList}
              rootNode={rootPane}
          >
              <div style={{width: '100vw', height: '100vh'}}>
                  <TileContainer/>
              </div>
          </TileProvider>
        </div>
    </>
}
export default Workspace;
