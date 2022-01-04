export default class RecipeCategory {
    constructor(countId, name) {
        this.CountId = countId ?? -1;
        this.Name = name ?? '';
    };

    Validate() {
        var validation = [];

        if (this.Name.length < 1) validation.push({ prop: 'Name', message: 'Please provide a valid name!' });

        return validation;
    }
};