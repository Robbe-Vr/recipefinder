import User from "./User"

export default class GroceryList {
    constructor(countId, id, name, value, user) {
        this.CountId = countId ?? -1;
        this.Id = id ?? '';
        this.Name = name ?? '';
        this.Value = value ?? '';
        this.UserId = user?.Id ?? '';
        this.User = user ?? new User();
    };
    
    User = new User();
};