import { Role, User, GroceryList, UnitType, IngredientCategory, Ingredient,
    RequirementsListIngredient, KitchenIngredient, RecipeCategory, Recipe, UserAction } from "../models";

const axios = require('axios').default;

const protocol = "https://", serverIp = "192.168.2.29",
    port = 5001, apiPage = "/api",
    api_url = protocol + serverIp + ":" + port + apiPage;

const defaultHeaders = (data) => ({ "Host": "localhost", "Accept": "*/*", "Connection": "keep-alive", "Content-Type": "application/json", "Content-Length": data.length });

class EntityGroup {
    constructor(groupName = '', api_path = '', accessToken, refreshToken) {
        this.Name = groupName;
        this.ApiUrl = api_url + (api_path.length > 0 ? "/" + api_path : '');

        if (accessToken) {
            this.AuthorizationHeaders["RecipeFinder_AccessToken"] = accessToken;
        }
        if (refreshToken) {
            this.AuthorizationHeaders["RecipeFinder_RefreshToken"] = refreshToken;
        }
    };

    AuthorizationHeaders = { };

    ApiUrl = '';
    Name = '';

    async GetAll() {
        try
        {
            var response = await axios.get(this.ApiUrl, { headers: this.AuthorizationHeaders });

            return response.data;
        }
        catch (e)
        {
            console.log(e);
            return "Error";
        }
    };

    async GetById(id = '') {
        try
        {
            var response = await axios.get(this.ApiUrl + "/" + id, { headers: this.AuthorizationHeaders });

            return response.data;
        }
        catch (e)
        {
            console.log(e);
            return "Error";
        }
    };

    async GetByName(name = '') {
        try
        {
            var response = await axios.get(this.ApiUrl + "/byname/" + name, { headers: this.AuthorizationHeaders });

            return response.data;
        }
        catch (e)
        {
            console.log(e);
            return "Error";
        }
    };

    async Create(newObj = {}) {
        try
        {
            const data = JSON.stringify(newObj, null, 4);

            var response = await axios.post(this.ApiUrl,
                data,
                { headers: { ...(defaultHeaders(data)), ...this.AuthorizationHeaders } });

            return response;
        }
        catch (e)
        {
            console.log(e);
            return "Error";
        }
    };

    async Update(id = '', updatedObj = {}) {
        try
        {
            const data = JSON.stringify(updatedObj, null, 4);

            var response = await axios.put(this.ApiUrl + "/" + id,
                data,
                { headers: { ...(defaultHeaders(data)), ...this.AuthorizationHeaders } });

            return response;
        }
        catch (e)
        {
            console.log(e);
            return "Error";
        }
    };

    async Delete(id = '', obj = {}) {
        try
        {
            const data = JSON.stringify(obj, null, 4);

            var response = await axios.delete(this.ApiUrl + '/' + id,
                { headers: { ...(defaultHeaders(data)), ...this.AuthorizationHeaders } });

            return response;
        }
        catch (e)
        {
            console.log(e);
            return "Error";
        }
    };

    async PerformCustom(type = 'get', url, obj = {}) {
        try
        {
            var response = {};

            if (type === 'get')
            {
                response = await axios.get(url, { headers: this.AuthorizationHeaders });
            }
            else if (type === 'post')
            {
                const data = JSON.stringify(obj, null, 4);

                response = await axios.post(url, data,
                    { headers: { ...(defaultHeaders(data)), ...this.AuthorizationHeaders } });
            }
            else if (type === 'put')
            {
                const data = JSON.stringify(obj, null, 4);

                response = await axios.put(url, data,
                    { headers: { ...(defaultHeaders(data)), ...this.AuthorizationHeaders } });
            }
            else if (type === 'delete')
            {
                const data = JSON.stringify(obj, null, 4);

                response = await axios.delete(url, data,
                    { headers: { ...(defaultHeaders(data)), ...this.AuthorizationHeaders } });
            }
            else response = 'Invalid request type!';

            return response;
        }
        catch (e)
        {
            console.log(e);
            return "Error";
        }
    };
};

class CustomEntityGroup extends EntityGroup {
    constructor(accessToken, refreshToken) {
        super("Custom", "", accessToken, refreshToken);
    };

    async Encrypt(text, salt) {
        var res = await super.PerformCustom('post', this.ApiUrl + '/Encrypt', { Text: text, Salt: salt });

        return res.data.Result;
    };

    async GetSalt() {
        var res = await super.PerformCustom('get', this.ApiUrl + '/Encrypt/getsalt');

        return res.data.Result;
    };

    async GetTokens(userId, code) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/Authorize/token', { code, userId });

        return res.data;
    };

    async ValidateAccessToken(accessToken) {
        var res = await super.PerformCustom('post', this.ApiUrl + '/Authorize/Validate', { accessToken });

        return res.data;
    };

    async RefreshAccessToken(refreshToken) {
        var res = await super.PerformCustom('post', this.ApiUrl + '/Authorize/Refresh', { refreshToken });

        return res.data;
    };

    async GetUserByAccessToken(accessToken) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/Authorize/Me', { accessToken });

        return new User(res.data.CountId, res.data.Id, res.data.Name, res.data.Email, res.data.PhoneNumber, res.data.PasswordHashed, res.data.Salt, res.data.DOB, res.data.CreationDate, res.data.Roles);
    };
};

class IngredientEntityGroup extends EntityGroup {
    constructor(accessToken, refreshToken) {
        super("Ingredients", "Ingredients", accessToken, refreshToken);
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new Ingredient(item.Id, item.Name, item.Categories, item.UnitTypes);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new Ingredient(item.Id, item.Name, item.Categories, item.UnitTypes);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new Ingredient(item.Id, item.Name, item.Categories, item.UnitTypes);

        return fixedData;
    };
};

class UserEntityGroup extends EntityGroup {
    constructor(accessToken, refreshToken) {
        super("Users", "Users", accessToken, refreshToken);
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new User(item.CountId, item.Id, item.Name, item.Email, item.PhoneNumber, item.PasswordHashed, item.Salt, item.DOB, item.CreationDate, item.Roles, item.Kitchen);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new User(item.CountId, item.Id, item.Name, item.Email, item.PhoneNumber, item.PasswordHashed, item.Salt, item.DOB, item.CreationDate, item.Roles, item.Kitchen);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new User(item.CountId, item.Id, item.Name, item.Email, item.PhoneNumber, item.PasswordHashed, item.Salt, item.DOB, item.CreationDate, item.Roles, item.Kitchen);

        return fixedData;
    };

    async GetActionsByUserId(id) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/' + id + "/actions");

        const fixedData = res.data && res !== "Error" && res.data.map ? res.data.map((item) => {
            return new UserAction(item.CountId, item.User, item.Endpoint, item.RequestType, item.Description, item.RefObject ? item.RefObject : { Id: item.RefObjectid, Name: item.RefObjectName }, item.ActionPerformedOnTable, item.Success );
        }) : [];

        return fixedData;
    };

    async GetRolesByUserId(id) {
        var data = await super.PerformCustom('get', this.ApiUrl + '/getroles/' + id);

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new Role(item.CountId, item.Id, item.Name, item.Users);
        }) : [];

        return fixedData;
    };
};

class RoleEntityGroup extends EntityGroup {
    constructor(accessToken, refreshToken) {
        super("Roles", "Roles", accessToken, refreshToken);
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new Role(item.CountId, item.Id, item.Name, item.Users);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new Role(item.CountId, item.Id, item.Name, item.Users);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new Role(item.CountId, item.Id, item.Name, item.Users);

        return fixedData;
    };
};

class RecipeEntityGroup extends EntityGroup {
    constructor(accessToken, refreshToken) {
        super("Recipes", "Recipes", accessToken, refreshToken);
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data.map((item) => {
            return new Recipe(item.id, item.name, item.categories, item.requirementsList, item.user);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new Recipe(item.id, item.name, item.categories, item.requirementsList, item.user);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new Recipe(item.id, item.name, item.categories, item.requirementsList, item.user);

        return fixedData;
    };
};

class KitchenEntityGroup extends EntityGroup {
    constructor(accessToken, refreshToken) {
        super("Kitchens", "Kitchens", accessToken, refreshToken);
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new KitchenIngredient(item.id, item.ingredient, item.units, item.unitType, item.user);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new KitchenIngredient(item.id, item.ingredient, item.units, item.unitType, item.user);

        return fixedData;
    };

    async GetKitchenByUserId(id) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byuserid/' + id);

        const fixedData = res.data;//.ingredients.map((item) => {
        //    return new KitchenIngredient(item.countId, item.ingredient, item.units, item.unitType, item.user);
        //});

        return fixedData;
    };

    async GetKitchenByUserName(name) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byusername/' + name);

        const fixedData = res.data && res !== "Error" && res.data.map ? res.data.map((item) => {
            return new KitchenIngredient(item.id, item.ingredient, item.units, item.unitType, item.user);
        }) : [];

        return fixedData;
    };
};

class RequirementsListEntityGroup extends EntityGroup {
    constructor(accessToken, refreshToken) {
        super("RequirementsLists", "RequirementsLists", accessToken, refreshToken);
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new RequirementsListIngredient(item.id, item.ingredient, item.units, item.unitType, item.recipe);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new RequirementsListIngredient(item.id, item.ingredient, item.units, item.unitType, item.recipe);

        return fixedData;
    };

    async GetRequirementsListByRecipeId(id) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byrecipeid/' + id);

        const fixedData = res.data && res !== "Error" && res.data.map ? res.data.map((item) => {
            return new RequirementsListIngredient(item.id, item.ingredient, item.units, item.unitType, item.recipe);
        }) : [];

        return fixedData;
    };

    async GetRequirementsListByRecipeName(name) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byrecipename/' + name);

        const fixedData = res.data && res !== "Error" && res.data.map ? res.data.map((item) => {
            return new RequirementsListIngredient(item.id, item.ingredient, item.units, item.unitType, item.recipe);
        }) : [];

        return fixedData;
    };
};

class UnitTypeEntityGroup extends EntityGroup {
    constructor(accessToken, refreshToken) {
        super("UnitTypes", "UnitTypes", accessToken, refreshToken);
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new UnitType(item.id, item.name, item.allowDecimals, item.ingredients);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new UnitType(item.id, item.name, item.allowDecimals, item.ingredients);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new UnitType(item.id, item.name, item.allowDecimals, item.ingredients);

        return fixedData;
    };
};

class IngredientCategoryEntityGroup extends EntityGroup {
    constructor(accessToken, refreshToken) {
        super("IngredientCategories", "IngredientCategories", accessToken, refreshToken);
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new IngredientCategory(item.id, item.name, item.ingredients);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new IngredientCategory(item.id, item.name, item.ingredients);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new IngredientCategory(item.id, item.name, item.ingredients);

        return fixedData;
    };
};

class RecipeCategoryEntityGroup extends EntityGroup {
    constructor(accessToken, refreshToken) {
        super("RecipeCategories", "RecipeCategories", accessToken, refreshToken);
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new RecipeCategory(item.id, item.name, item.recipes);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new RecipeCategory(item.id, item.name, item.recipes);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new RecipeCategory(item.id, item.name, item.recipes);

        return fixedData;
    };
};

class GroceryListEntityGroup extends EntityGroup {
    constructor(accessToken, refreshToken) {
        super("GroceryLists", "GroceryLists", accessToken, refreshToken);
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new GroceryList(item.id, item.name, item.value, item.user);
        }) : [];

        return fixedData;
    };

    async GetAllByUserId(id) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byuserid/' + id);

        const fixedData = res.data && res !== "Error" && res.data.map ? res.data.map((item) => {
            return new GroceryList(item.id, item.name, item.value, item.user);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new GroceryList(item.id, item.name, item.value, item.user);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new GroceryList(item.id, item.name, item.value, item.user);

        return fixedData;
    };
};

export default class Api {
    constructor(accessToken, refreshToken) {
        const authReturnUrlPath = '/returnAuthorization';

        const authPage = "/api/authorize/login",
            params = `?ReturnUrl=http://localhost:3000` + authReturnUrlPath;

        this.AuthorizationPage = protocol + serverIp + ":" + port + authPage + params;

        this.AuthReturnUrlPath = authReturnUrlPath;

        this.Ingredients = new IngredientEntityGroup(accessToken, refreshToken);
        this.Users = new UserEntityGroup(accessToken, refreshToken);
        this.Roles = new RoleEntityGroup(accessToken, refreshToken);
        this.Recipes = new RecipeEntityGroup(accessToken, refreshToken);
        this.Kitchens = new KitchenEntityGroup(accessToken, refreshToken);
        this.RequirementsLists = new RequirementsListEntityGroup(accessToken, refreshToken);
        this.UnitTypes = new UnitTypeEntityGroup(accessToken, refreshToken);
        this.IngredientCategories = new IngredientCategoryEntityGroup(accessToken, refreshToken);
        this.RecipeCategories = new RecipeCategoryEntityGroup(accessToken, refreshToken);
        this.GroceryLists = new GroceryListEntityGroup(accessToken, refreshToken);
        this.Custom = new CustomEntityGroup(accessToken, refreshToken);
    };
};