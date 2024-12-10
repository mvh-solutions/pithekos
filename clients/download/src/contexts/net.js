import {createContext} from 'react';

const NetContext = createContext({enableNet: false, setEnableNet: ()=>{}});

export default NetContext;