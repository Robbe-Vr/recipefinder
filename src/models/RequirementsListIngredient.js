import Ingredient from "./Ingredient"
import Recipe from "./Recipe";
import UnitType from "./UnitType"

export default class RequirementsListIngredient {
    constructor(id, ingredient, units, unitType, recipe) {
        this.id = id;
        this.ingredientId = ingredient.id;
        this.ingredient = ingredient;
        this.units = units;
        this.unitTypeId = unitType.id;
        this.unitType = unitType;
        this.recipeId = recipe.id;
        this.recipe = recipe;
    };

    id = '';
    ingredientId = '';
    ingredient = Ingredient;
    units = 0;
    unitTypeId = '';
    unitType = UnitType;
    recipeId = '';
    recipe = Recipe;
};