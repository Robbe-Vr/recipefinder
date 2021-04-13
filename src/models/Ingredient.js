export default class Ingredient {
    constructor(id, name, categories, unitTypes) {
        this.id = id;
        this.name = name;
        this.categories = categories;
        this.unitTypes = unitTypes;
    };

    id = '';
    name = '';
    categories = [IngredientCategory];
    unitTypes = [UnitType];
};