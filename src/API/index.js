const axios = require('axios').default;
import { Role, User, GroceryList, UnitType, IngredientCategory, Ingredient,
    RequirementsListIngredient, KitchenIngredient, RecipeCategory, Recipe } from "./models";

const protocol = "https://", serverIp = "localhost",
    port = 5001, apiPage = "/api",
    api_url = protocol + serverIp + ":" + port + apiPage;

export default class Api {
    constructor() {
        EntityGroups.push(new IngredientEntityGroup(),
                        new UserEntityGroup(),
                        new RoleEntityGroup(),
                        new RecipeEntityGroup(),
                        new KitchenEntityGroup(),
                        new RequirementsListEntityGroup(),
                        new UnitTypeEntityGroup(),
                        new IngredientCategoryEntityGroup(),
                        new RecipeCategoryEntityGroup(),
                        new GroceryListEntityGroup(),
        );
    };

    entityGroupExists(name = '') {
        return EntityGroups.map(eg => eg.Name).includes(name);
    };

    entityGroup(entityGroupName) {
        if (!this.entityGroupExists(entityGroupName)) {
            return {
                error: `An entity group with the name '${entityGroupName}' does not exist.`,
            };
        }
        return EntityGroups.filter(eg => eg.Name === entityGroupName)[0];
    };
};

class EntityGroup {
    constructor(groupName = '', api_path = '') {
        this.Name = groupName;
        this.ApiUrl = api_url + "/" + api_path;
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
            if (type == 'get')
            {
                var response = await axios.get(url);

                return response;
            }
            else if (type == 'post')
            {
                var response = await axios.post(url, obj);

                return response;
            }
            else if (type == 'put')
            {
                var response = await axios.put(url, obj);

                return response;
            }
            else if (type == 'delete')
            {
                var response = await axios.delete(url, obj);

                return response;
            }
            else return 'Invalid request type!';
        }
        catch (e)
        {
            console.log(e);
            return "Error";
        }
    };
};

class IngredientEntityGroup extends EntityGroup {
    constructor() {
        super("Ingredients", "Ingredients");
    };

    async GetAll() {
        var data = await super.GetAll();

        fixedData = data.map((item) => {
            return new Ingredient(item.id, item.name, item.categories, item.UnitTypes);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        fixedData = new Ingredient(item.id, item.name, item.categories, item.UnitTypes);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        fixedData = new Ingredient(item.id, item.name, item.categories, item.UnitTypes);

        return fixedData;
    };
};

class UserEntityGroup extends EntityGroup {
    constructor() {
        super("Users", "Users");
    };

    async GetAll() {
        var data = await super.GetAll();

        fixedData = data.map((item) => {
            return new User(item.id, item.name, item.email, item.password, item.salt, item.dateOfBirth, item.roles, item.kitchen);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        fixedData = new User(item.id, item.name, item.email, item.password, item.salt, item.dateOfBirth, item.roles, item.kitchen);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        fixedData = new User(item.id, item.name, item.email, item.password, item.salt, item.dateOfBirth, item.roles, item.kitchen);

        return fixedData;
    };

    async GetRolesByUserId(id) {
        var data = await super.PerformCustom('get', this.ApiUrl + '/getroles/' + id);

        fixedData = data.map((item) => {
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

        fixedData = data.map((item) => {
            return new Role(item.id, item.name, item.users);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        fixedData = new Role(item.id, item.name, item.users);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        fixedData = new Role(item.id, item.name, item.users);

        return fixedData;
    };
};

class RecipeEntityGroup extends EntityGroup {
    constructor() {
        super("Recipes", "Recipes");
    };

    async GetAll() {
        var data = await super.GetAll();

        fixedData = data.map((item) => {
            return new Recipe(item.id, item.name, item.categories, item.requirementsList, item.user);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        fixedData = new Recipe(item.id, item.name, item.categories, item.requirementsList, item.user);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        fixedData = new Recipe(item.id, item.name, item.categories, item.requirementsList, item.user);

        return fixedData;
    };
};

class KitchenEntityGroup extends EntityGroup {
    constructor() {
        super("Kitchens", "Kitchens");
    };

    async GetAll() {
        var data = await super.GetAll();

        fixedData = data.map((item) => {
            return new KitchenIngredient(item.id, item.ingredient, item.units, item.unitType, item.user);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        fixedData = new KitchenIngredient(item.id, item.ingredient, item.units, item.unitType, item.user);

        return fixedData;
    };

    async GetKitchenByUserId(id) {
        var data = await super.PerformCustom('get', this.ApiUrl + '/byuserid/' + id);

        fixedData = data.map((item) => {
            return new KitchenIngredient(item.id, item.ingredient, item.units, item.unitType, item.user);
        });

        return fixedData;
    };

    async GetKitchenByUserName(name) {
        var data = await super.PerformCustom('get', this.ApiUrl + '/byusername/' + name);

        fixedData = data.map((item) => {
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
        var data = await super.GetAll();

        fixedData = data.map((item) => {
            return new RequirementsListIngredient(item.id, item.ingredient, item.units, item.unitType, item.recipe);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        fixedData = new RequirementsListIngredient(item.id, item.ingredient, item.units, item.unitType, item.recipe);

        return fixedData;
    };

    async GetRequirementsListByRecipeId(id) {
        var data = await super.PerformCustom('get', this.ApiUrl + '/byrecipeid/' + id);

        fixedData = data.map((item) => {
            return new RequirementsListIngredient(item.id, item.ingredient, item.units, item.unitType, item.recipe);
        });

        return fixedData;
    };

    async GetRequirementsListByRecipeName(name) {
        var data = await super.PerformCustom('get', this.ApiUrl + '/byrecipename/' + name);

        fixedData = data.map((item) => {
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

        fixedData = data.map((item) => {
            return new UnitType(item.id, item.name, item.allowDecimals, item.ingredients);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        fixedData = new UnitType(item.id, item.name, item.allowDecimals, item.ingredients);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        fixedData = new UnitType(item.id, item.name, item.allowDecimals, item.ingredients);

        return fixedData;
    };
};

class IngredientCategoryEntityGroup extends EntityGroup {
    constructor() {
        super("IngredientCategories", "IngredientCategories");
    };

    async GetAll() {
        var data = await super.GetAll();

        fixedData = data.map((item) => {
            return new IngredientCategory(item.id, item.name, item.ingredients);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        fixedData = new IngredientCategory(item.id, item.name, item.ingredients);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        fixedData = new IngredientCategory(item.id, item.name, item.ingredients);

        return fixedData;
    };
};

class RecipeCategoryEntityGroup extends EntityGroup {
    constructor() {
        super("RecipeCategories", "RecipeCategories");
    };

    async GetAll() {
        var data = await super.GetAll();

        fixedData = data.map((item) => {
            return new RecipeCategory(item.id, item.name, item.recipes);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        fixedData = new RecipeCategory(item.id, item.name, item.recipes);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        fixedData = new RecipeCategory(item.id, item.name, item.recipes);

        return fixedData;
    };
};

class GroceryListEntityGroup extends EntityGroup {
    constructor() {
        super("GroceryLists", "GroceryLists");
    };

    async GetAll() {
        var data = await super.GetAll();

        fixedData = data.map((item) => {
            return new GroceryList(item.id, item.name, item.value, item.user);
        });

        return fixedData;
    };

    async GetAllByUserId(id) {
        var data = await super.PerformCustom('get', this.ApiUrl + '/byuserid/' + id);

        fixedData = data.map((item) => {
            return new GroceryList(item.id, item.name, item.value, item.user);
        });

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        fixedData = new GroceryList(item.id, item.name, item.value, item.user);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        fixedData = new GroceryList(item.id, item.name, item.value, item.user);

        return fixedData;
    };
};

const EntityGroups = [new EntityGroup()];
EntityGroups.pop();