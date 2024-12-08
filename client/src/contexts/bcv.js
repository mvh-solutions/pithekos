import {createContext} from 'react';

const BcvContext = createContext({systemBcv: false, setSystemBcv: ()=>{}});

export default BcvContext;