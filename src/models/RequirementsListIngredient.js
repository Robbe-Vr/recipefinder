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

    Validate() {
        var validation = [];

        if (this.IngredientId.length < 1) validation.push({ prop: 'IngredientId', message: 'Invalid ingredient selected!' });
        if (this.Units < 0.01 || this.Units > 1000.00) validation.push({ prop: 'Units', message: 'Invalid amount provided! (Needs to be between 0.01 and 1000.00)' });
        if (this.UnitTypeId < 1) validation.push({ prop: 'UnitTypeId', message: 'Invalid unit type selected!' });
        if (this.RecipeId < 1) validation.push({ prop: 'RecipeId', message: 'Please provide a valid recipe!' });

        return validation;
    }
};