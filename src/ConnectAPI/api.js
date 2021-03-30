import React, { useState, useEffect, useContext } from "react";
import Api from "../API/index";

const ApiContext = React.createContext({});

const API = new Api();

export function ApiProvider({ children }) {
    const GetEntityGroup = (entityGroupName) => {
        return API.entityGroup(entityGroupName);
    };

    var contextValue = {
        GetEntityGroup,
    };

    console.log("Loading API...");

    return (
        <ApiContext.Provider value={contextValue}>
            {children}
        </ApiContext.Provider>
    );
};

export function useAPI() {
    return useContext(ApiContext);
};