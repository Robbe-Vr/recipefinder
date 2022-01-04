import User from "./User"

export default class GroceryList {
    constructor(countId, id, name, value, user) {
        this.CountId = countId ?? -1;
        this.Id = id ?? '';
        this.Name = name ?? '';
        this.Value = value ?? '';
        this.UserId = user?.Id ?? '';
        this.User = user ?? null;
    };
    
    Value = '';
    User = new User();

    Validate() {
        var validation = [];

        if (this.Name.length < 1) validation.push({ prop: 'Name', message: 'Please provide a valid name!' });
        if (this.Value.length < 1) validation.push({ prop: 'Name', message: 'Please provide a valid name!' });
        if (this.UserId < 1) validation.push({ prop: 'UserId', message: 'Please provide a valid user!' });

        return validation;
    }
};