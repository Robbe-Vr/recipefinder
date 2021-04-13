export default class GroceryList {
    constructor(id, name, value, user) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.user = user;
    };

    id = '';
    name = '';
    value = '';
    user = User;
};