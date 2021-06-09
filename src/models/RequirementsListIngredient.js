import Ingredient from "./Ingredient"
import UnitType from "./UnitType"

export default class RequirementsListIngredient {
    constructor(countId, ingredient, units, unitType, recipe) {
        this.CountId = countId ?? -1;
        this.IngredientId = ingredient?.Id ?? '';
        this.Ingredient = ingredient ?? null;
        this.Units = units ?? 0.00;
        this.UnitTypeId = unitType?.CountId ?? -1;
        this.UnitType = unitType ?? null;
        this.RecipeId = recipe?.Id ?? '';
        this.Recipe = recipe ?? null;
    };

    Ingredient = new Ingredient();
    UnitType = new UnitType();
};