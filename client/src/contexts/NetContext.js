import { createContext } from "react";

export const NetContext = createContext({enableNet: false, setEnableNet: () => {}});