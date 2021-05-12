import User from "./User"

export default class GroceryList {
    constructor(id, name, value, user) {
        this.Id = id ?? '';
        this.Name = name ?? '';
        this.Value = value ?? '';
        this.UserId = user?.Id ?? '';
        this.User = user ?? new User();
    };
    
    User = new User();
};