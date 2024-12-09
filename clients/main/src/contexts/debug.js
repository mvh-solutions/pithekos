import {createContext} from 'react';

const DebugContext = createContext({debug: false, setDebug: ()=>{}});

export default DebugContext;