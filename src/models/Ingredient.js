import IngredientCategory from "./IngredientCategory"
import UnitType from "./UnitType"

export default class Ingredient {
    constructor(id, name, categories, unitTypes) {
        this.Id = id ?? '';
        this.Name = name ?? '';
        this.Categories = categories ?? [];
        this.UnitTypes = unitTypes ?? [];
    };

    Id = '';
    Name = '';
    Categories = [new IngredientCategory()];
    UnitTypes = [new UnitType()];
};