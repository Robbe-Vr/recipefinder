import React, { useContext } from "react";
import Api from "../API/api";

const ACCOUNT_LS = "recipefinder_account";

const ApiContext = React.createContext({});

export function ApiProvider({ children }) {
    
    var account = localStorage.getItem(ACCOUNT_LS);

    try
    {
        account = JSON.parse(account);
    }
    catch (e)
    {
        console.log(e);
        account = {};
    }

    const API = new Api(account?.AccessToken, account?.RefreshToken);

    var contextValue = {
        Api: API,
        Ingredients: API.Ingredients,
        Users: API.Users,
        Roles: API.Roles,
        Recipes: API.Recipes,
        Kitchens: API.Kitchens,
        RequirementsLists: API.RequirementsLists,
        UnitTypes: API.UnitTypes,
        IngredientCategories: API.IngredientCategories,
        RecipeCategories: API.RecipeCategories,
        GroceryLists: API.GroceryLists,
        Custom: API.Custom,
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