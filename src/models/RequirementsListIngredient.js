export default class RequirementsListIngredient {
    constructor(id, ingredient, units, unitType, recipe) {
        this.id = id;
        this.ingredient = ingredient;
        this.units = units;
        this.unitType = unitType;
        this.recipe = recipe;
    };

    id = '';
    ingredient = Ingredient;
    units = 0;
    unitType = UnitType;
    recipeId = '';
};