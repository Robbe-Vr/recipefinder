export default class UnitType {
    constructor(countId, name, allowDecimals) {
        this.CountId = countId ?? -1;
        this.Name = name ?? '';
        this.AllowDecimals = allowDecimals ?? false;
    };

    Validate() {
        var validation = [];

        if (this.Name.length < 0) validation.push({ prop: 'Name', message: 'Please provide a valid name!' });

        return validation;
    }
};