export default class UnitType {
    constructor(id, name, allowDecimals) {
        this.id = id;
        this.name = name;
        this.allowDecimals = allowDecimals;
    };

    id = '';
    name = '';
    allowDecimals = false;
};