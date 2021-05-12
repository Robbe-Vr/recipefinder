export default class UnitType {
    constructor(countId, name, allowDecimals) {
        this.CountId = countId ?? -1;
        this.Name = name ?? '';
        this.AllowDecimals = allowDecimals ?? false;
    };
};