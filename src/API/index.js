const axios = require('axios').default;

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

            console.log(response);
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

            console.log(response.data);
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

            console.log(response);
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

            console.log(response);
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
            var response = await axios.delete(this.ApiUrl + id);

            console.log(response);
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
};

class UserEntityGroup extends EntityGroup {
    constructor() {
        super("Users", "Users");
    };
};

class RoleEntityGroup extends EntityGroup {
    constructor() {
        super("Roles", "Roles");
    };
};

class RecipeEntityGroup extends EntityGroup {
    constructor() {
        super("Recipes", "Recipes");
    };
};

class KitchenEntityGroup extends EntityGroup {
    constructor() {
        super("Kitchens", "Kitchens");
    };
};

class RequirementsListEntityGroup extends EntityGroup {
    constructor() {
        super("RequirementsLists", "RequirementsLists");
    };
};

class UnitTypeEntityGroup extends EntityGroup {
    constructor() {
        super("UnitTypes", "UnitTypes");
    };
};

class IngredientCategoryEntityGroup extends EntityGroup {
    constructor() {
        super("IngredientCategories", "IngredientCategories");
    };
};

class RecipeCategoryEntityGroup extends EntityGroup {
    constructor() {
        super("RecipeCategories", "RecipeCategories");
    };
};

class GroceryListEntityGroup extends EntityGroup {
    constructor() {
        super("GroceryLists", "GroceryLists");
    };
};

const EntityGroups = [new EntityGroup()];
EntityGroups.pop();