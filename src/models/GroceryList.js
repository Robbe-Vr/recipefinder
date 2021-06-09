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
};