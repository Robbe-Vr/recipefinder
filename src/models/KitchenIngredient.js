import Ingredient from "./Ingredient"
import UnitType from "./UnitType"

export default class KitchenIngredient {
    constructor(id, ingredient, units, unitType, user) {
        this.Id = id ?? '';
        this.Ingredient = ingredient ?? new Ingredient();
        this.Units = units ?? 0.00;
        this.UnitType = unitType ?? new UnitType();
        this.UserId = user?.Id ?? '';
        this.User = user;
    };

    Id = '';
    IngredientId = '';
    Ingredient = new Ingredient();
    Units = 0;
    UnitTypeId = '';
    UnitType = new UnitType();
    UserId = '';
    User;
};