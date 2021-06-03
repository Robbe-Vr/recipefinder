import { EntityGroup } from "./BaseEntityGroup";

import { Ingredient, IngredientCategory, Recipe, RecipeCategory, RequirementsListIngredient, UnitType, User, Role } from "../../models";

export class RecipeEntityGroup extends EntityGroup {
    constructor() {
        super("Recipes", "Recipes");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new Recipe(item.CountId, item.Id, item.Name, item.Description, item.ImageLocation, item.IsPublic, item.PreparationSteps, item.VideoTutorialLink,
                item.Categories ? item.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
                item.RequirementsList?.Ingredients ? item.RequirementsList?.Ingredients.map(requirement => new RequirementsListIngredient(requirement.CountId,
                    new Ingredient(requirement.Ingredient.CountId, requirement.Ingredient.Id, requirement.Ingredient.Name, requirement.Ingredient.ImageLocation, requirement.Ingredient.AverageWeightInKgPerUnit, requirement.Ingredient.AverageVolumeInLiterPerUnit,
                        requirement.Ingredient.Categories ? requirement.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                        requirement.Ingredient.UnitTypes ? requirement.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                    requirement.Units, new UnitType(requirement.UnitType.CountId, requirement.UnitType.Name, requirement.UnitType.AllowDecimals),
                    new Recipe(requirement.Recipe.CountId, requirement.Recipe.Id, requirement.Recipe.Name, requirement.Recipe.Description, requirement.Recipe.ImageLocation, requirement.Recipe.IsPublic, requirement.Recipe.PreparationSteps, requirement.Recipe.VideoTutorialLink,
                        requirement.Recipe.Categories ? requirement.Recipe.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
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
                    new Ingredient(requirement.Ingredient.CountId, requirement.Ingredient.Id, requirement.Ingredient.Name, requirement.Ingredient.ImageLocation, requirement.Ingredient.AverageWeightInKgPerUnit, requirement.Ingredient.AverageVolumeInLiterPerUnit,
                        requirement.Ingredient.Categories ? requirement.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                        requirement.Ingredient.UnitTypes ? requirement.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                    requirement.Units, new UnitType(requirement.UnitType.CountId, requirement.UnitType.Name, requirement.UnitType.AllowDecimals),
                    new Recipe(requirement.Recipe.CountId, requirement.Recipe.Id, requirement.Recipe.Name, requirement.Recipe.Description, requirement.Recipe.ImageLocation, requirement.Recipe.IsPublic, requirement.Recipe.PreparationSteps, requirement.Recipe.VideoTutorialLink,
                        requirement.Recipe.Categories ? requirement.Recipe.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
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
                    new Ingredient(requirement.Ingredient.CountId, requirement.Ingredient.Id, requirement.Ingredient.Name, requirement.Ingredient.ImageLocation, requirement.Ingredient.AverageWeightInKgPerUnit, requirement.Ingredient.AverageVolumeInLiterPerUnit,
                        requirement.Ingredient.Categories ? requirement.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                        requirement.Ingredient.UnitTypes ? requirement.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                    requirement.Units, new UnitType(requirement.UnitType.CountId, requirement.UnitType.Name, requirement.UnitType.AllowDecimals),
                    new Recipe(requirement.Recipe.CountId, requirement.Recipe.Id, requirement.Recipe.Name, requirement.Recipe.Description, requirement.Recipe.ImageLocation, requirement.Recipe.IsPublic, requirement.Recipe.PreparationSteps, requirement.Recipe.VideoTutorialLink,
                        requirement.Recipe.Categories ? requirement.Recipe.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
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

        const fixedData = item && item !== "Error" ? new Recipe(item.CountId, item.Id, item.Name, item.Description, item.ImageLocation, item.IsPublic, item.PreparationSteps, item.VideoTutorialLink,
            item.Categories ? item.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
            item.RequirementsList?.Ingredients ? item.RequirementsList?.Ingredients.map(requirement => new RequirementsListIngredient(requirement.CountId,
                new Ingredient(requirement.Ingredient.CountId, requirement.Ingredient.Id, requirement.Ingredient.Name, requirement.Ingredient.ImageLocation, requirement.Ingredient.AverageWeightInKgPerUnit, requirement.Ingredient.AverageVolumeInLiterPerUnit,
                    requirement.Ingredient.Categories ? requirement.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                    requirement.Ingredient.UnitTypes ? requirement.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                requirement.Units, new UnitType(requirement.UnitType.CountId, requirement.UnitType.Name, requirement.UnitType.AllowDecimals),
                new Recipe(requirement.Recipe.CountId, requirement.Recipe.Id, requirement.Recipe.Name, requirement.Recipe.Description, requirement.Recipe.ImageLocation, requirement.Recipe.IsPublic, requirement.Recipe.PreparationSteps, requirement.Recipe.VideoTutorialLink,
                    requirement.Recipe.Categories ? requirement.Recipe.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
                    null, requirement.Recipe.User ? new User(requirement.Recipe.User.CountId, requirement.Recipe.User.Id, requirement.Recipe.User.Name, requirement.Recipe.User.Email,
                        requirement.Recipe.User.PhoneNumber, requirement.Recipe.User.PasswordHashed, requirement.Recipe.User.Salt, requirement.Recipe.User.DOB, requirement.Recipe.User.CreationDate,
                        requirement.Recipe.User.Roles ? requirement.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []) : null)
            )) : [],
            new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt, item.User.DOB, item.User.CreationDate,
                item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : [])) : null;

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = item && item !== "Error" ? new Recipe(item.CountId, item.Id, item.Name, item.Description, item.ImageLocation, item.IsPublic, item.PreparationSteps, item.VideoTutorialLink,
            item.Categories ? item.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
            item.RequirementsList?.Ingredients ? item.RequirementsList?.Ingredients.map(requirement => new RequirementsListIngredient(requirement.CountId,
                new Ingredient(requirement.Ingredient.CountId, requirement.Ingredient.Id, requirement.Ingredient.Name, requirement.Ingredient.ImageLocation, requirement.Ingredient.AverageWeightInKgPerUnit, requirement.Ingredient.AverageVolumeInLiterPerUnit,
                    requirement.Ingredient.Categories ? requirement.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                    requirement.Ingredient.UnitTypes ? requirement.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                requirement.Units, new UnitType(requirement.UnitType.CountId, requirement.UnitType.Name, requirement.UnitType.AllowDecimals),
                new Recipe(requirement.Recipe.CountId, requirement.Recipe.Id, requirement.Recipe.Name, requirement.Recipe.Description, requirement.Recipe.ImageLocation, requirement.Recipe.IsPublic, requirement.Recipe.PreparationSteps, requirement.Recipe.VideoTutorialLink,
                    requirement.Recipe.Categories ? requirement.Recipe.Categories.map(category => new RecipeCategory(category.CountId, category.Name)) : [],
                    null, requirement.Recipe.User ? new User(requirement.Recipe.User.CountId, requirement.Recipe.User.Id, requirement.Recipe.User.Name, requirement.Recipe.User.Email,
                        requirement.Recipe.User.PhoneNumber, requirement.Recipe.User.PasswordHashed, requirement.Recipe.User.Salt, requirement.Recipe.User.DOB, requirement.Recipe.User.CreationDate,
                        requirement.Recipe.User.Roles ? requirement.Recipe.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []) : null)
            )) : [],
            new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt, item.User.DOB, item.User.CreationDate,
                item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : [])) : null;

        return fixedData;
    };
};