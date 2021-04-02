import { Role, User, GroceryList, UnitType, IngredientCategory, Ingredient,
    RequirementsListIngredient, KitchenIngredient, RecipeCategory, Recipe } from "./models";

const axios = require('axios').default;

const protocol = "https://", serverIp = "localhost",
    port = 5001, apiPage = "/api",
    api_url = protocol + serverIp + ":" + port + apiPage;

class EntityGroup {
    constructor(groupName = '', api_path = '') {
        this.Name = groupName;
        this.ApiUrl = api_url + (api_path.length > 0 ? "/" + api_path : '');
    };

    ApiUrl = '';
    Name = '';

    async GetAll() {
        try
        {
            var response = await axios.get(this.ApiUrl);

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
            var response = await axios.get(this.ApiUrl + "/" + id);

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
            var response = await axios.get(this.ApiUrl + "/byname/" + name);

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
            var response = await axios.post(this.ApiUrl,
                newObj);

            return response;
        }
        catch (e)
        {
            console.log(e);
            return "Error";
        }
    };

    async Update(updatedObj = {}) {
        try
        {
            var response = await axios.put(this.ApiUrl,
                updatedObj);

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
            var response = await axios.delete(this.ApiUrl + '/' + id);

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
                response = await axios.get(url);
            }
            else if (type === 'post')
            {
                response = await axios.post(url, obj);
            }
            else if (type === 'put')
            {
                response = await axios.put(url, obj);
            }
            else if (type === 'delete')
            {
                response = await axios.delete(url, obj);
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
    constructor() {
        super("Custom", "");
    };

    async Encrypt(text, salt) {
        var res = await super.PerformCustom('post', this.ApiUrl + '/Encrypt', { Text: text, Salt: salt });

        return res.data.result;
    };

    async GetSalt() {
        var res = await super.PerformCustom('get', this.ApiUrl + '/Encrypt/getsalt');

        return res.data.result;
    }
};

class IngredientEntityGroup extends EntityGroup {
    constructor() {
        super("Ingredients", "Ingredients");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data.map((item) => {
            return new Ingredient(item.id, item.name, item.categories, item.UnitTypes);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new Ingredient(item.id, item.name, item.categories, item.UnitTypes);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new Ingredient(item.id, item.name, item.categories, item.UnitTypes);

        return fixedData;
    };
};

class UserEntityGroup extends EntityGroup {
    constructor() {
        super("Users", "Users");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data.map((item) => {
            return new User(item.id, item.name, item.email, item.passwordHashed, item.salt, item.dateOfBirth, item.roles, item.kitchen);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new User(item.id, item.name, item.email, item.passwordHashed, item.salt, item.dateOfBirth, item.roles, item.kitchen);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new User(item.id, item.name, item.email, item.passwordHashed, item.salt, item.dateOfBirth, item.roles, item.kitchen);

        return fixedData;
    };

    async GetRolesByUserId(id) {
        var data = await super.PerformCustom('get', this.ApiUrl + '/getroles/' + id);

        const fixedData = data.map((item) => {
            return new Role(item.id, item.name, item.users);
        });

        return fixedData;
    };
};

class RoleEntityGroup extends EntityGroup {
    constructor() {
        super("Roles", "Roles");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data.map((item) => {
            return new Role(item.id, item.name, item.users);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new Role(item.id, item.name, item.users);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new Role(item.id, item.name, item.users);

        return fixedData;
    };
};

class RecipeEntityGroup extends EntityGroup {
    constructor() {
        super("Recipes", "Recipes");
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
    constructor() {
        super("Kitchens", "Kitchens");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data.map((item) => {
            return new KitchenIngredient(item.id, item.ingredient, item.units, item.unitType, item.user);
        });

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

        const fixedData = res.data.map((item) => {
            return new KitchenIngredient(item.id, item.ingredient, item.units, item.unitType, item.user);
        });

        return fixedData;
    };
};

class RequirementsListEntityGroup extends EntityGroup {
    constructor() {
        super("RequirementsLists", "RequirementsLists");
    };

    async GetAll() {
        var res = await super.GetAll();

        const fixedData = res.data.map((item) => {
            return new RequirementsListIngredient(item.id, item.ingredient, item.units, item.unitType, item.recipe);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new RequirementsListIngredient(item.id, item.ingredient, item.units, item.unitType, item.recipe);

        return fixedData;
    };

    async GetRequirementsListByRecipeId(id) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byrecipeid/' + id);

        const fixedData = res.data.map((item) => {
            return new RequirementsListIngredient(item.id, item.ingredient, item.units, item.unitType, item.recipe);
        });

        return fixedData;
    };

    async GetRequirementsListByRecipeName(name) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byrecipename/' + name);

        const fixedData = res.data.map((item) => {
            return new RequirementsListIngredient(item.id, item.ingredient, item.units, item.unitType, item.recipe);
        });

        return fixedData;
    };
};

class UnitTypeEntityGroup extends EntityGroup {
    constructor() {
        super("UnitTypes", "UnitTypes");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data.map((item) => {
            return new UnitType(item.id, item.name, item.allowDecimals, item.ingredients);
        });

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
    constructor() {
        super("IngredientCategories", "IngredientCategories");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data.map((item) => {
            return new IngredientCategory(item.id, item.name, item.ingredients);
        });

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
    constructor() {
        super("RecipeCategories", "RecipeCategories");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data.map((item) => {
            return new RecipeCategory(item.id, item.name, item.recipes);
        });

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
    constructor() {
        super("GroceryLists", "GroceryLists");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data.map((item) => {
            return new GroceryList(item.id, item.name, item.value, item.user);
        });

        return fixedData;
    };

    async GetAllByUserId(id) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byuserid/' + id);

        const fixedData = res.data.map((item) => {
            return new GroceryList(item.id, item.name, item.value, item.user);
        });

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
    constructor() {
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

    Ingredients = IngredientEntityGroup;
    Users = UserEntityGroup;
    Roles = RoleEntityGroup;
    Recipes = RecipeEntityGroup;
    Kitchens = KitchenEntityGroup;
    RequirementsLists = RequirementsListEntityGroup;
    UnitTypes = UnitTypeEntityGroup;
    IngredientCategories = IngredientCategoryEntityGroup;
    RecipeCategories = RecipeCategoryEntityGroup;
    GroceryLists = GroceryListEntityGroup;
    Custom = CustomEntityGroup;
};