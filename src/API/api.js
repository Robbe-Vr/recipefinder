import { Role, User, GroceryList, UnitType, IngredientCategory, Ingredient,
    RequirementsListIngredient, KitchenIngredient, RecipeCategory, Recipe, UserAction } from "../models";

import {
    CustomEntityGroup,
    IngredientEntityGroup,
    UserEntityGroup,
    RoleEntityGroup,
    RecipeEntityGroup,
    KitchenEntityGroup,
    RequirementsListEntityGroup,
    UnitTypeEntityGroup,
    IngredientCategoryEntityGroup,
    RecipeCategoryEntityGroup,
    GroceryListEntityGroup,
    
    protocol, serverIp, port, api_url
} from "./EntityGroups";

export default class Api {
    constructor() {
        const authReturnUrlPath = '/returnAuthorization';

        const authPage = "/api/authorize/login",
            params = `?ReturnUrl=${window.location.protocol}//${window.location.hostname}:${window.location.port}${authReturnUrlPath}`;

        this.AuthorizationPage = protocol + serverIp + ":" + port + authPage + params;

        this.AuthReturnUrlPath = authReturnUrlPath;

        this.Url = api_url;
        this.AccessTokenHeaderName = AccessTokenHeaderName;

        this.Ingredients = new IngredientEntityGroup();
        this.Users = new UserEntityGroup();
        this.Roles = new RoleEntityGroup();
        this.Recipes = new RecipeEntityGroup();
        this.Kitchens = new KitchenEntityGroup();
        this.RequirementsLists = new RequirementsListEntityGroup();
        this.UnitTypes = new UnitTypeEntityGroup();
        this.IngredientCategories = new IngredientCategoryEntityGroup();
        this.RecipeCategories = new RecipeCategoryEntityGroup();
        this.GroceryLists = new GroceryListEntityGroup();
        this.Custom = new CustomEntityGroup();
    };
};