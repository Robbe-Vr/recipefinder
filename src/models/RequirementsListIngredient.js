import Ingredient from "./Ingredient"
import Recipe from "./Recipe";
import UnitType from "./UnitType"

export default class RequirementsListIngredient {
    constructor(id, ingredient, units, unitType, recipe) {
        this.Id = id ?? '';
        this.IngredientId = ingredient?.Id ?? '';
        this.Ingredient = ingredient ?? new Ingredient();
        this.Units = units ?? 0.00;
        this.UnitTypeId = unitType?.Id ?? '';
        this.UnitType = unitType ?? new UnitType();
        this.RecipeId = recipe?.Id ?? '';
        this.Recipe = recipe ?? new Recipe();
    };

    Id = '';
    IngredientId = '';
    Ingredient = Ingredient;
    Units = 0;
    UnitTypeId = '';
    UnitType = UnitType;
    RecipeId = '';
    Recipe = Recipe;
};