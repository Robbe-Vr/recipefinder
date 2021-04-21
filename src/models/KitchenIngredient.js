import Ingredient from "./Ingredient"
import UnitType from "./UnitType"
import User from "./User"

export default class KitchenIngredient {
    constructor(id, ingredient, units, unitType, user) {
        this.Id = id;
        this.Ingredient = ingredient;
        this.Units = units;
        this.UnitType = unitType;
        this.UserId = user.id;
        this.User = user;
    };

    Id = '';
    IngredientId = '';
    Ingredient = Ingredient;
    Units = 0;
    UnitTypeId = '';
    UnitType = UnitType;
    UserId = '';
    User = User;
};