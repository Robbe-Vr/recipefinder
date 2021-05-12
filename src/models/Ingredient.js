import IngredientCategory from "./IngredientCategory"
import UnitType from "./UnitType"

export default class Ingredient {
    constructor(countId, id, name, imgLocation, avgkgPerUnit, avgLPerUnit, categories, unitTypes) {
        this.CountId = countId ?? -1;
        this.Id = id ?? '';
        this.Name = name ?? '';
        this.ImageLocation = imgLocation ?? '';
        this.AverageWeightInKgPerUnit = avgkgPerUnit ?? 0.00;
        this.AverageVolumeInLiterPerUnit = avgLPerUnit ?? 0.00;
        this.Categories = categories ?? [];
        this.UnitTypes = unitTypes ?? [];
    };

    Categories = [new IngredientCategory()];
    UnitTypes = [new UnitType()];
};