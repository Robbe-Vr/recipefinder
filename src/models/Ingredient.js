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

    Validate() {
        var validation = [];

        if (this.Name.length < 1) validation.push({ prop: 'Name', message: 'Please provide a valid name!' });
        if (this.Categories?.length < 1) validation.push({ prop: 'Categories', message: 'Please select at least one category!' });
        if (this.UnitTypes?.length < 1) validation.push({ prop: 'UnitTypes', message: 'Please select at least one unit type!' });
        if (this.UnitTypes?.filter(u => u.Name === "Kg").length === 1 && this.UnitTypes.length > 1 && this.AverageWeightInKgPerUnit < 0.01)
            validation.push({ prop: 'AverageWeightInKgPerUnit', message: 'Please provide an avg weight per unit when supplied with multiple unit types!' });
        if (this.UnitTypes?.filter(u => u.Name === "L").length === 1 && this.UnitTypes.length > 1 && this.AverageVolumeInLiterPerUnit < 0.01)
            validation.push({ prop: 'AverageWeightInKgPerUnit', message: 'Please provide an avg volume per unit when supplied with multiple unit types!' });

        return validation;
    }
};