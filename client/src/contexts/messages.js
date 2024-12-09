import {createContext} from 'react';

const MessagesContext = createContext({messages: [], setMessages: ()=>{}});

export default MessagesContext;