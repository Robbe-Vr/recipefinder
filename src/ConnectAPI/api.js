import React, { useContext } from "react";
import Api from "../API/index";

const ApiContext = React.createContext({});

const API = new Api();

export function ApiProvider({ children }) {
    
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