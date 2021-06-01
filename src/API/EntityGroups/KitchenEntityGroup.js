import { EntityGroup } from "./BaseEntityGroup";

import { KitchenIngredient, Ingredient, IngredientCategory, UnitType, User, Role } from "../../models";

export class KitchenEntityGroup extends EntityGroup {
    constructor() {
        super("Kitchens", "Kitchens");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new KitchenIngredient(item.Id, new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLiterPerUnit,
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

        const fixedData = new KitchenIngredient(item.Id, new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLiterPerUnit,
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
            return new KitchenIngredient(item.Id, new Ingredient(item.Ingredient.CountId, item.Ingredient.Id, item.Ingredient.Name, item.Ingredient.ImageLocation, item.Ingredient.AverageWeightInKgPerUnit, item.Ingredient.AverageVolumeInLiterPerUnit,
                item.Ingredient.Categories ? item.Ingredient.Categories.map(category => new IngredientCategory(category.CountId, category.Name)) : [],
                item.Ingredient.UnitTypes ? item.Ingredient.UnitTypes.map(unitType => new UnitType(unitType.CountId, unitType.Name, unitType.AllowDecimals)) : []),
                item.Units, new UnitType(item.UnitType.CountId, item.UnitType.Name, item.UnitType.AllowDecimals),
                new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt, item.User.DOB, item.User.CreationDate,
                    item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));
        }) : [];

        return fixedData;
    };
};