import Ingredient from "./Ingredient"
import UnitType from "./UnitType"

export default class KitchenIngredient {
    constructor(countId, ingredient, units, unitType, user) {
        this.CountId = countId ?? -1;
        this.IngredientId = ingredient?.Id ?? '';
        this.Ingredient = ingredient ?? null;
        this.Units = units ?? 0.00;
        this.UnitTypeId = unitType?.CountId ?? -1;
        this.UnitType = unitType ?? null;
        this.UserId = user?.Id ?? '';
        this.User = user;
    };

    Ingredient = new Ingredient();
    UnitType = new UnitType();
};