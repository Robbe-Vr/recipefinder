export default class KitchenIngredient {
    constructor(id, ingredient, units, unitType, user) {
        this.id = id;
        this.ingredient = ingredient;
        this.units = units;
        this.unitType = unitType;
        this.user = user;
    };

    id = '';
    ingredient = Ingredient;
    units = 0;
    unitType = UnitType;
    user = User;
};