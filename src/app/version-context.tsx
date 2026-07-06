import { createContext, useContext } from "react";

export type AppVersion = "1.0" | "2.0";

const VersionContext = createContext<AppVersion>("1.0");

export const VersionProvider = VersionContext.Provider;

export const useVersion = () => useContext(VersionContext);
