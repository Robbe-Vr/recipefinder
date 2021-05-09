export default class UnitType {
    constructor(countId, name, allowDecimals) {
        this.CountId = countId ? countId : this.CountId;
        this.Name = name ? name : this.Name;
        this.AllowDecimals = allowDecimals ? allowDecimals : this.AllowDecimals;
    };

    CountId = -1;
    Name = '';
    AllowDecimals = false;
};