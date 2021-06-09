import { Role, User, GroceryList, UnitType, IngredientCategory, Ingredient,
    RequirementsListIngredient, KitchenIngredient, RecipeCategory, Recipe, UserAction } from "../models";

const axios = require('axios').default;

const protocol = "https://", serverIp = window.location.hostname === "localhost" ? "localhost" : 
                                        window.location.hostname === "192.168.2.101" ? "192.169.2.101" :
                                        window.location.hostname.indexOf("sywapps.com") > -1 ? "recipefinderapi.sywapps.com" : "",
    port = 5001, apiPage = "/api",
    api_url = protocol + serverIp + ":" + port + apiPage;

const defaultHeaders = (data) => ({ "Accept": "*/*", "Content-Type": "application/json" });

const AccessTokenHeaderName = "RecipeFinder_AccessToken";

var accessToken;
const AuthorizationHeaders = () => {
    if (!accessToken) {
        accessToken = getAccessToken();
    }

    return ({ [AccessTokenHeaderName]: accessToken });
};

function HandlerError(error) {
    if (error.response) {
        console.log(`${error.response.status} - `, error.response.data.Message ?? error.response.data);
    } else if (error.request) {
        console.log(`Request failed: `, error.request);
    } else {
        console.log(`Axios request execution fail: ${error.message}`, error);
    }

    return "Error";
};

function getAccessToken() {
    const ACCOUNT_LS = "recipefinder_account";

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

    return account?.AccessToken;
};

class EntityGroup {
    constructor(groupName = '', api_path = '') {
        this.Name = groupName;
        this.ApiUrl = api_url + (api_path.length > 0 ? "/" + api_path : '');

        if (!accessToken) {
            getAccessToken();
        }
    };

    ApiUrl = '';
    Name = '';

    async GetAll() {
        try
        {
            var response = await axios.get(this.ApiUrl, { headers: AuthorizationHeaders() });

            return response.data;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    };

    async GetById(id = '') {
        try
        {
            var response = await axios.get(this.ApiUrl + "/" + id, { headers: AuthorizationHeaders() });

            return response.data;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    };

    async GetByName(name = '') {
        try
        {
            var response = await axios.get(this.ApiUrl + "/byname/" + name, { headers: AuthorizationHeaders() });

            return response.data;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    };

    async Create(newObj = {}) {
        try
        {
            const data = JSON.stringify(newObj, null, 4);

            var response = await axios.post(this.ApiUrl,
                data,
                { headers: { ...(defaultHeaders(data)), ...AuthorizationHeaders() } });

            return response;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    };

    async Update(id = '', updatedObj = {}) {
        try
        {
            const data = JSON.stringify(updatedObj, null, 4);

            var response = await axios.put(this.ApiUrl + "/" + id,
                data,
                { headers: { ...(defaultHeaders(data)), ...AuthorizationHeaders() } });

            return response;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    };

    async Delete(id = '', obj = {}) {
        try
        {
            const data = JSON.stringify(obj, null, 4);

            var response = await axios.delete(this.ApiUrl + '/' + id,
                { headers: { ...(defaultHeaders(data)), ...AuthorizationHeaders() } });

            return response;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    };

    async PerformCustom(type = 'get', url, obj = {}, headers = {}) {
        try
        {
            var response = {};

            headers = { ...AuthorizationHeaders(), ...headers };

            if (type === 'get')
            {
                response = await axios.get(url, { headers: headers });
            }
            else if (type === 'post')
            {
                const data = JSON.stringify(obj, null, 4);

                headers = { ...defaultHeaders(data), ...headers };

                response = await axios.post(url, data,
                    { headers: headers });
            }
            else if (type === 'put')
            {
                const data = JSON.stringify(obj, null, 4);

                headers = { ...defaultHeaders(data), ...headers };

                response = await axios.put(url, data,
                    { headers: headers });
            }
            else if (type === 'delete')
            {
                const data = JSON.stringify(obj, null, 4);

                headers = { ...defaultHeaders(data), ...headers };

                response = await axios.delete(url, data,
                    { headers: headers });
            }
            else response = 'Invalid request type!';

            return response;
        }
        catch (e)
        {
            console.log(`Failed request to '${url}' as ${type.toUpperCase()}`, e);

            HandlerError(e);

            return { info: e, error: true, data: "Error" };
        }
    };
};

class CustomEntityGroup extends EntityGroup {
    constructor() {
        super("Custom", "");
    };

    async Encrypt(text, salt) {
        var res = await super.PerformCustom('post', this.ApiUrl + '/Encrypt', { Text: text, Salt: salt });

        if (res.error) {
            return "Error";
        }

        return res.data.Result;
    };

    async GetSalt() {
        var res = await super.PerformCustom('get', this.ApiUrl + '/Encrypt/getsalt');

        if (res.error) {
            return "Error";
        }

        return res.data.Result;
    };

    async LogOut(headers) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/Authorize/logout?show', null, headers);

        if (res.error) {
            return "Error";
        }

        return res.data;
    };

    async ValidateAccessToken(headers) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/Authorize/Validate', null, headers);

        if (res.error) {
            return "Error";
        }

        return res.data;
    };

    async RefreshAccessToken(headers) {
        var res = await super.PerformCustom('post', this.ApiUrl + '/Authorize/Refresh', null, headers);

        if (res.error) {
            return "Error";
        }

        return res.data;
    };

    async GetUserByAccessToken(headers) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/Authorize/Me', null, headers);

        if (res.error) {
            return "Error";
        }

        const item = res.data;

        return new User(item.CountId, item.Id, item.Name, item.Email, item.PhoneNumber, item.PasswordHashed, item.Salt, item.DOB, item.CreationDate,
            item.Roles ? item.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []);
    };
};

class IngredientEntityGroup extends EntityGroup {
    constructor() {
        super("Ingredients", "Ingredients");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new Ingredient(item.CountId, item.Id, item.Name, item.ImageLocation, item.AverageWeightInKgPerUnit, item.AverageVolumeInLPerUnit,
                item.Categories ? item.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                item.UnitTypes ? item.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new Ingredient(item.CountId, item.Id, item.Name, item.ImageLocation, item.AverageWeightInKgPerUnit, item.AverageVolumeInLPerUnit,
            item.Categories ? item.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
            item.UnitTypes ? item.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new Ingredient(item.CountId, item.Id, item.Name, item.ImageLocation, item.AverageWeightInKgPerUnit, item.AverageVolumeInLPerUnit,
            item.Categories ? item.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
            item.UnitTypes ? item.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []);

        return fixedData;
    };
};

class UserEntityGroup extends EntityGroup {
    constructor() {
        super("Users", "Users");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new User(item.CountId, item.Id, item.Name, item.Email, item.PhoneNumber, item.PasswordHashed, item.Salt, item.DOB, item.CreationDate,
                item.Roles ? item.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new User(item.CountId, item.Id, item.Name, item.Email, item.PhoneNumber, item.PasswordHashed, item.Salt, item.DOB, item.CreationDate,
            item.Roles ? item.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new User(item.CountId, item.Id, item.Name, item.Email, item.PhoneNumber, item.PasswordHashed, item.Salt, item.DOB, item.CreationDate,
            item.Roles ? item.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []);

        return fixedData;
    };

    async GetActionsByUserId(id) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/' + id + "/actions");

        const fixedData = res.data && res !== "Error" && res.data.map ? res.data.map((item) => {
            return new UserAction(item.CountId,
                new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt, item.User.DOB, item.User.CreationDate,
                    item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []),
                item.Endpoint, item.RequestType, item.Description, item.RefObject ? item.RefObject : { Id: item.RefObjectid, Name: item.RefObjectName }, item.ActionPerformedOnTable, item.Success );
        }) : [];

        return fixedData;
    };

    async GetRolesByUserId(id) {
        var data = await super.PerformCustom('get', this.ApiUrl + '/getroles/' + id);

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new Role(item.CountId, item.Id, item.Name);
        }) : [];

        return fixedData;
    };
};

class RoleEntityGroup extends EntityGroup {
    constructor() {
        super("Roles", "Roles");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new Role(item.CountId, item.Id, item.Name);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new Role(item.CountId, item.Id, item.Name);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new Role(item.CountId, item.Id, item.Name);

        return fixedData;
    };
};

class RecipeEntityGroup extends EntityGroup {
    constructor() {
        super("Recipes", "Recipes");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new Recipe(item.CountId, item.Id, item.Name, item.Description, item.ImageLocation, item.IsPublic, item.PreparationSteps, item.VideoTutorialLink,
                item.Categories ? item.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
                item.RequirementsList?.Ingredients ? item.RequirementsList?.Ingredients.map(requirement => new RequirementsListIngredient(requirement.CountId,
                    new Ingredient(requirement.Ingredient.CountId, requirement.Ingredient.Id, requirement.Ingredient.Name, requirement.Ingredient.ImageLocation, requirement.Ingredient.AverageWeightInKgPerUnit, requirement.Ingredient.AverageVolumeInLPerUnit,
                        requirement.Ingredient.Categories ? requirement.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                        requirement.Ingredient.UnitTypes ? requirement.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                    requirement.Units, new UnitType(requirement.UnitType.CountId, requirement.UnitType.Name, requirement.UnitType.AllowDecimals),
                    new Recipe(requirement.Recipe.CountId, requirement.Recipe.Id, requirement.Recipe.Name, requirement.Recipe.Description, requirement.Recipe.ImageLocation, requirement.Recipe.IsPublic, requirement.Recipe.PreparationSteps, requirement.Recipe.VideoTutorialLink,
                        requirement.Recipe.Categories ? requirement.Recipe.Categories.map(category => RecipeCategory(category.CountId, category.Name)) : [],
                        null, requirement.Recipe.User ? new User(requirement.Recipe.User.CountId, requirement.Recipe.User.Id, requirement.Recipe.User.Name, requirement.Recipe.User.Email,
                            requirement.Recipe.User.PhoneNumber, requirement.Recipe.User.PasswordHashed, requirement.Recipe.User.Salt, requirement.Recipe.User.DOB, requirement.Recipe.User.CreationDate,
                            requirement.Recipe.User.Roles ? requirement.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []) : null)
                )) : [],
                new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt, item.User.DOB, item.User.CreationDate,
                    item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));
        }) : [];

        return fixedData;
    };

    async GetPreparableForUser(userId) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/preparable/' + userId);

        const fixedData = res.data && res.data !== "Error" && res.data.map ? res.data.map((item) => {
            return new Recipe(item.CountId, item.Id, item.Name, item.Description, item.ImageLocation, item.IsPublic, item.PreparationSteps, item.VideoTutorialLink,
                item.Categories ? item.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
                item.RequirementsList?.Ingredients ? item.RequirementsList?.Ingredients.map(requirement => new RequirementsListIngredient(requirement.CountId,
                    new Ingredient(requirement.Ingredient.CountId, requirement.Ingredient.Id, requirement.Ingredient.Name, requirement.Ingredient.ImageLocation, requirement.Ingredient.AverageWeightInKgPerUnit, requirement.Ingredient.AverageVolumeInLPerUnit,
                        requirement.Ingredient.Categories ? requirement.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                        requirement.Ingredient.UnitTypes ? requirement.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                    requirement.Units, new UnitType(requirement.UnitType.CountId, requirement.UnitType.Name, requirement.UnitType.AllowDecimals),
                    new Recipe(requirement.Recipe.CountId, requirement.Recipe.Id, requirement.Recipe.Name, requirement.Recipe.Description, requirement.Recipe.ImageLocation, requirement.Recipe.IsPublic, requirement.Recipe.PreparationSteps, requirement.Recipe.VideoTutorialLink,
                        requirement.Recipe.Categories ? requirement.Recipe.Categories.map(category => RecipeCategory(category.CountId, category.Name)) : [],
                        null, requirement.Recipe.User ? new User(requirement.Recipe.User.CountId, requirement.Recipe.User.Id, requirement.Recipe.User.Name, requirement.Recipe.User.Email,
                            requirement.Recipe.User.PhoneNumber, requirement.Recipe.User.PasswordHashed, requirement.Recipe.User.Salt, requirement.Recipe.User.DOB, requirement.Recipe.User.CreationDate,
                            requirement.Recipe.User.Roles ? requirement.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []) : null)
                )) : [],
                new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt, item.User.DOB, item.User.CreationDate,
                    item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));
        }) : [];

        return fixedData;
    };

    async GetAllFromCook(userId) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/bycook/' + userId);

        const fixedData = res.data && res.data !== "Error" && res.data.map ? res.data.map((item) => {
            return new Recipe(item.CountId, item.Id, item.Name, item.Description, item.ImageLocation, item.IsPublic, item.PreparationSteps, item.VideoTutorialLink,
                item.Categories ? item.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
                item.RequirementsList?.Ingredients ? item.RequirementsList?.Ingredients.map(requirement => new RequirementsListIngredient(requirement.CountId,
                    new Ingredient(requirement.Ingredient.CountId, requirement.Ingredient.Id, requirement.Ingredient.Name, requirement.Ingredient.ImageLocation, requirement.Ingredient.AverageWeightInKgPerUnit, requirement.Ingredient.AverageVolumeInLPerUnit,
                        requirement.Ingredient.Categories ? requirement.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                        requirement.Ingredient.UnitTypes ? requirement.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                    requirement.Units, new UnitType(requirement.UnitType.CountId, requirement.UnitType.Name, requirement.UnitType.AllowDecimals),
                    new Recipe(requirement.Recipe.CountId, requirement.Recipe.Id, requirement.Recipe.Name, requirement.Recipe.Description, requirement.Recipe.ImageLocation, requirement.Recipe.IsPublic, requirement.Recipe.PreparationSteps, requirement.Recipe.VideoTutorialLink,
                        requirement.Recipe.Categories ? requirement.Recipe.Categories.map(category => RecipeCategory(category.CountId, category.Name)) : [],
                        null, requirement.Recipe.User ? new User(requirement.Recipe.User.CountId, requirement.Recipe.User.Id, requirement.Recipe.User.Name, requirement.Recipe.User.Email,
                            requirement.Recipe.User.PhoneNumber, requirement.Recipe.User.PasswordHashed, requirement.Recipe.User.Salt, requirement.Recipe.User.DOB, requirement.Recipe.User.CreationDate,
                            requirement.Recipe.User.Roles ? requirement.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []) : null)
                )) : [],
                new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt, item.User.DOB, item.User.CreationDate,
                    item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new Recipe(item.CountId, item.Id, item.Name, item.Description, item.ImageLocation, item.IsPublic, item.PreparationSteps, item.VideoTutorialLink,
            item.Categories ? item.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
            item.RequirementsList?.Ingredients ? item.RequirementsList?.Ingredients.map(requirement => new RequirementsListIngredient(requirement.CountId,
                new Ingredient(requirement.Ingredient.CountId, requirement.Ingredient.Id, requirement.Ingredient.Name, requirement.Ingredient.ImageLocation, requirement.Ingredient.AverageWeightInKgPerUnit, requirement.Ingredient.AverageVolumeInLPerUnit,
                    requirement.Ingredient.Categories ? requirement.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                    requirement.Ingredient.UnitTypes ? requirement.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                requirement.Units, new UnitType(requirement.UnitType.CountId, requirement.UnitType.Name, requirement.UnitType.AllowDecimals),
                new Recipe(requirement.Recipe.CountId, requirement.Recipe.Id, requirement.Recipe.Name, requirement.Recipe.Description, requirement.Recipe.ImageLocation, requirement.Recipe.IsPublic, requirement.Recipe.PreparationSteps, requirement.Recipe.VideoTutorialLink,
                    requirement.Recipe.Categories ? requirement.Recipe.Categories.map(category => RecipeCategory(category.CountId, category.Name)) : [],
                    null, requirement.Recipe.User ? new User(requirement.Recipe.User.CountId, requirement.Recipe.User.Id, requirement.Recipe.User.Name, requirement.Recipe.User.Email,
                        requirement.Recipe.User.PhoneNumber, requirement.Recipe.User.PasswordHashed, requirement.Recipe.User.Salt, requirement.Recipe.User.DOB, requirement.Recipe.User.CreationDate,
                        requirement.Recipe.User.Roles ? requirement.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []) : null)
            )) : [],
            new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt, item.User.DOB, item.User.CreationDate,
                item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new Recipe(item.CountId, item.Id, item.Name, item.Description, item.ImageLocation, item.IsPublic, item.PreparationSteps, item.VideoTutorialLink,
            item.Categories ? item.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
            item.RequirementsList?.Ingredients ? item.RequirementsList?.Ingredients.map(requirement => new RequirementsListIngredient(requirement.CountId,
                new Ingredient(requirement.Ingredient.CountId, requirement.Ingredient.Id, requirement.Ingredient.Name, requirement.Ingredient.ImageLocation, requirement.Ingredient.AverageWeightInKgPerUnit, requirement.Ingredient.AverageVolumeInLPerUnit,
                    requirement.Ingredient.Categories ? requirement.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                    requirement.Ingredient.UnitTypes ? requirement.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                requirement.Units, new UnitType(requirement.UnitType.CountId, requirement.UnitType.Name, requirement.UnitType.AllowDecimals),
                new Recipe(requirement.Recipe.CountId, requirement.Recipe.Id, requirement.Recipe.Name, requirement.Recipe.Description, requirement.Recipe.ImageLocation, requirement.Recipe.IsPublic, requirement.Recipe.PreparationSteps, requirement.Recipe.VideoTutorialLink,
                    requirement.Recipe.Categories ? requirement.Recipe.Categories.map(category => RecipeCategory(category.CountId, category.Name)) : [],
                    null, requirement.Recipe.User ? new User(requirement.Recipe.User.CountId, requirement.Recipe.User.Id, requirement.Recipe.User.Name, requirement.Recipe.User.Email,
                        requirement.Recipe.User.PhoneNumber, requirement.Recipe.User.PasswordHashed, requirement.Recipe.User.Salt, requirement.Recipe.User.DOB, requirement.Recipe.User.CreationDate,
                        requirement.Recipe.User.Roles ? requirement.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []) : null)
            )) : [],
            new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt, item.User.DOB, item.User.CreationDate,
                item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));

        return fixedData;
    };
};

class KitchenEntityGroup extends EntityGroup {
    constructor() {
        super("Kitchens", "Kitchens");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new KitchenIngredient(item.Id, new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLPerUnit,
                item.Ingredient.Categories ? item.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                item.Ingredient.UnitTypes ? item.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                item.Units, new UnitType(item.UnitType.CountId, item.UnitType.Name, item.UnitType.AllowDecimals),
                new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt, item.User.DOB, item.User.CreationDate,
                    item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new KitchenIngredient(item.Id, new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLPerUnit,
            item.Ingredient.Categories ? item.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
            item.Ingredient.UnitTypes ? item.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
            item.Units, new UnitType(item.UnitType.CountId, item.UnitType.Name, item.UnitType.AllowDecimals),
            new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt, item.User.DOB, item.User.CreationDate,
                item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));

        return fixedData;
    };

    async GetKitchenByUserId(id) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byuserid/' + id);

        const fixedData = res.data;

        return fixedData;
    };

    async GetKitchenByUserName(name) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byusername/' + name);

        const fixedData = res.data && res !== "Error" && res.data.map ? res.data.map((item) => {
            return new KitchenIngredient(item.Id, new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLPerUnit,
                item.Ingredient.Categories ? item.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                item.Ingredient.UnitTypes ? item.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                item.Units, new UnitType(item.UnitType.CountId, item.UnitType.Name, item.UnitType.AllowDecimals),
                new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt, item.User.DOB, item.User.CreationDate,
                    item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));
        }) : [];

        return fixedData;
    };
};

class RequirementsListEntityGroup extends EntityGroup {
    constructor() {
        super("RequirementsLists", "RequirementsLists");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new RequirementsListIngredient(item.CountId,
                new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLPerUnit,
                    item.Ingredient.Categories ? item.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                    item.Ingredient.UnitTypes ? item.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                item.Units, new UnitType(item.UnitType.CountId, item.UnitType.Name, item.UnitType.AllowDecimals),
                new Recipe(item.Recipe.CountId, item.Recipe.Id, item.Recipe.Name, item.Recipe.Description, item.Recipe.ImageLocation, item.Recipe.IsPublic, item.Recipe.PreparationSteps, item.Recipe.VideoTutorialLink,
                    item.Recipe.Categories ? item.Recipe.Categories.map(category => RecipeCategory(category.CountId, category.Name)) : [],
                    null, new User(item.Recipe.User.CountId, item.Recipe.User.Id, item.Recipe.User.Name, item.Recipe.User.Email,
                        item.Recipe.User.PhoneNumber, item.Recipe.User.PasswordHashed, item.Recipe.User.Salt, item.Recipe.User.DOB, item.Recipe.User.CreationDate,
                        item.Recipe.User.Roles ? item.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []))
                )
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new RequirementsListIngredient(item.CountId,
            new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLPerUnit,
                item.Ingredient.Categories ? item.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                item.Ingredient.UnitTypes ? item.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
            item.Units, new UnitType(item.UnitType.CountId, item.UnitType.Name, item.UnitType.AllowDecimals),
            new Recipe(item.Recipe.CountId, item.Recipe.Id, item.Recipe.Name, item.Recipe.Description, item.Recipe.ImageLocation, item.Recipe.IsPublic, item.Recipe.PreparationSteps, item.Recipe.VideoTutorialLink,
                item.Recipe.Categories ? item.Recipe.Categories.map(category => RecipeCategory(category.CountId, category.Name)) : [],
                null, new User(item.Recipe.User.CountId, item.Recipe.User.Id, item.Recipe.User.Name, item.Recipe.User.Email,
                    item.Recipe.User.PhoneNumber, item.Recipe.User.PasswordHashed, item.Recipe.User.Salt, item.Recipe.User.DOB, item.Recipe.User.CreationDate,
                    item.Recipe.User.Roles ? item.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : [])));

        return fixedData;
    };

    async GetRequirementsListByRecipeId(id) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byrecipeid/' + id);

        const fixedData = res.data && res !== "Error" && res.data.map ? res.data.map((item) => {
            return new RequirementsListIngredient(item.CountId,
                new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLPerUnit,
                    item.Ingredient.Categories ? item.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                    item.Ingredient.UnitTypes ? item.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                item.Units, new UnitType(item.UnitType.CountId, item.UnitType.Name, item.UnitType.AllowDecimals),
                new Recipe(item.Recipe.CountId, item.Recipe.Id, item.Recipe.Name, item.Recipe.Description, item.Recipe.ImageLocation, item.Recipe.IsPublic, item.Recipe.PreparationSteps, item.Recipe.VideoTutorialLink,
                    item.Recipe.Categories ? item.Recipe.Categories.map(category => RecipeCategory(category.CountId, category.Name)) : [],
                    null, new User(item.Recipe.User.CountId, item.Recipe.User.Id, item.Recipe.User.Name, item.Recipe.User.Email,
                        item.Recipe.User.PhoneNumber, item.Recipe.User.PasswordHashed, item.Recipe.User.Salt, item.Recipe.User.DOB, item.Recipe.User.CreationDate,
                        item.Recipe.User.Roles ? item.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []))
                )
        }) : [];

        return fixedData;
    };

    async GetRequirementsListByRecipeName(name) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byrecipename/' + name);

        const fixedData = res.data && res !== "Error" && res.data.map ? res.data.map((item) => {
            return new RequirementsListIngredient(item.CountId,
                new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLPerUnit,
                    item.Ingredient.Categories ? item.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                    item.Ingredient.UnitTypes ? item.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                item.Units, new UnitType(item.UnitType.CountId, item.UnitType.Name, item.UnitType.AllowDecimals),
                new Recipe(item.Recipe.CountId, item.Recipe.Id, item.Recipe.Name, item.Recipe.Description, item.Recipe.ImageLocation, item.Recipe.IsPublic, item.Recipe.PreparationSteps, item.Recipe.VideoTutorialLink,
                    item.Recipe.Categories ? item.Recipe.Categories.map(category => RecipeCategory(category.CountId, category.Name)) : [],
                    null, new User(item.Recipe.User.CountId, item.Recipe.User.Id, item.Recipe.User.Name, item.Recipe.User.Email,
                        item.Recipe.User.PhoneNumber, item.Recipe.User.PasswordHashed, item.Recipe.User.Salt, item.Recipe.User.DOB, item.Recipe.User.CreationDate,
                        item.Recipe.User.Roles ? item.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : [])));
        }) : [];

        return fixedData;
    };
};

class UnitTypeEntityGroup extends EntityGroup {
    constructor() {
        super("UnitTypes", "UnitTypes");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new UnitType(item.CountId, item.Name, item.AllowDecimals);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new UnitType(item.CountId, item.Name, item.AllowDecimals);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new UnitType(item.CountId, item.Name, item.AllowDecimals);

        return fixedData;
    };
};

class IngredientCategoryEntityGroup extends EntityGroup {
    constructor() {
        super("IngredientCategories", "IngredientCategories");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new IngredientCategory(item.CountId, item.Name);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new IngredientCategory(item.CountId, item.Name);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new IngredientCategory(item.CountId, item.Name);

        return fixedData;
    };
};

class RecipeCategoryEntityGroup extends EntityGroup {
    constructor() {
        super("RecipeCategories", "RecipeCategories");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new RecipeCategory(item.CountId, item.Name);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new RecipeCategory(item.CountId, item.Name);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new RecipeCategory(item.CountId, item.Name);

        return fixedData;
    };
};

class GroceryListEntityGroup extends EntityGroup {
    constructor() {
        super("GroceryLists", "GroceryLists");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new GroceryList(item.CountId, item.Name, item.Value,
                new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt,
                    item.User.DOB, item.User.CreationDate,
                    item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));
        }) : [];

        return fixedData;
    };

    async GetAllByUserId(id) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byuserid/' + id);

        const fixedData = res.data && res !== "Error" && res.data.map ? res.data.map((item) => {
            return new GroceryList(item.CountId, item.Name, item.Value,
                new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt,
                    item.User.DOB, item.User.CreationDate,
                    item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new GroceryList(item.CountId, item.Name, item.Value,
            new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt,
                item.User.DOB, item.User.CreationDate,
                item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new GroceryList(item.CountId, item.Name, item.Value,
            new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt,
                item.User.DOB, item.User.CreationDate,
                item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));

        return fixedData;
    };
};

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