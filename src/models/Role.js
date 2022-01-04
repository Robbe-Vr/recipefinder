export default class Role {
    constructor(countId, id, name) {
        this.CountId = countId ?? -1;
        this.Id = id ?? '';
        this.Name = name ?? '';
    };

    Validate() {
        var validation = [];

        if (this.Name.length < 0) validation.push({ prop: 'Name', message: 'Please provide a valid name!' });

        return validation;
    }
};