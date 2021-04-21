export default class UnitType {
    constructor(id, name, allowDecimals) {
        this.Id = id ? id : this.Id;
        this.Name = name ? name : this.Name;
        this.AllowDecimals = allowDecimals ? allowDecimals : this.AllowDecimals;
    };

    Id = -1;
    Name = '';
    AllowDecimals = false;
};