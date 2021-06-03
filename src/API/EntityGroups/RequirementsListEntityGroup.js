import { EntityGroup } from "./BaseEntityGroup";

import { RequirementsListIngredient, Ingredient, IngredientCategory, Recipe, RecipeCategory, UnitType, User, Role } from "../../models";

export class RequirementsListEntityGroup extends EntityGroup {
    constructor() {
        super("RequirementsLists", "RequirementsLists");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new RequirementsListIngredient(item.CountId,
                new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLiterPerUnit,
                    item.Ingredient.Categories ? item.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                    item.Ingredient.UnitTypes ? item.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                item.Units, new UnitType(item.UnitType.CountId, item.UnitType.Name, item.UnitType.AllowDecimals),
                new Recipe(item.Recipe.CountId, item.Recipe.Id, item.Recipe.Name, item.Recipe.Description, item.Recipe.ImageLocation, item.Recipe.IsPublic, item.Recipe.PreparationSteps, item.Recipe.VideoTutorialLink,
                    item.Recipe.Categories ? item.Recipe.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
                    null, new User(item.Recipe.User.CountId, item.Recipe.User.Id, item.Recipe.User.Name, item.Recipe.User.Email,
                        item.Recipe.User.PhoneNumber, item.Recipe.User.PasswordHashed, item.Recipe.User.Salt, item.Recipe.User.DOB, item.Recipe.User.CreationDate,
                        item.Recipe.User.Roles ? item.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []))
                )
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = item && item !== "Error" ? new RequirementsListIngredient(item.CountId,
            new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLiterPerUnit,
                item.Ingredient.Categories ? item.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                item.Ingredient.UnitTypes ? item.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
            item.Units, new UnitType(item.UnitType.CountId, item.UnitType.Name, item.UnitType.AllowDecimals),
            new Recipe(item.Recipe.CountId, item.Recipe.Id, item.Recipe.Name, item.Recipe.Description, item.Recipe.ImageLocation, item.Recipe.IsPublic, item.Recipe.PreparationSteps, item.Recipe.VideoTutorialLink,
                item.Recipe.Categories ? item.Recipe.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
                null, new User(item.Recipe.User.CountId, item.Recipe.User.Id, item.Recipe.User.Name, item.Recipe.User.Email,
                    item.Recipe.User.PhoneNumber, item.Recipe.User.PasswordHashed, item.Recipe.User.Salt, item.Recipe.User.DOB, item.Recipe.User.CreationDate,
                    item.Recipe.User.Roles ? item.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []))) : null;

        return fixedData;
    };

    async GetRequirementsListByRecipeId(id) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byrecipeid/' + id);

        const fixedData = res.data && res !== "Error" && res.data.map ? res.data.map((item) => {
            return new RequirementsListIngredient(item.CountId,
                new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLiterPerUnit,
                    item.Ingredient.Categories ? item.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                    item.Ingredient.UnitTypes ? item.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                item.Units, new UnitType(item.UnitType.CountId, item.UnitType.Name, item.UnitType.AllowDecimals),
                new Recipe(item.Recipe.CountId, item.Recipe.Id, item.Recipe.Name, item.Recipe.Description, item.Recipe.ImageLocation, item.Recipe.IsPublic, item.Recipe.PreparationSteps, item.Recipe.VideoTutorialLink,
                    item.Recipe.Categories ? item.Recipe.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
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
                new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLiterPerUnit,
                    item.Ingredient.Categories ? item.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                    item.Ingredient.UnitTypes ? item.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                item.Units, new UnitType(item.UnitType.CountId, item.UnitType.Name, item.UnitType.AllowDecimals),
                new Recipe(item.Recipe.CountId, item.Recipe.Id, item.Recipe.Name, item.Recipe.Description, item.Recipe.ImageLocation, item.Recipe.IsPublic, item.Recipe.PreparationSteps, item.Recipe.VideoTutorialLink,
                    item.Recipe.Categories ? item.Recipe.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
                    null, new User(item.Recipe.User.CountId, item.Recipe.User.Id, item.Recipe.User.Name, item.Recipe.User.Email,
                        item.Recipe.User.PhoneNumber, item.Recipe.User.PasswordHashed, item.Recipe.User.Salt, item.Recipe.User.DOB, item.Recipe.User.CreationDate,
                        item.Recipe.User.Roles ? item.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : [])));
        }) : [];

        return fixedData;
    };
};