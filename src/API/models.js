

export class Role {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    };

    id = '';
    name = '';
};

export class User {
    constructor(id, name, email, passwordHashed, salt, dateOfBirth, roles) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHashed = passwordHashed;
        this.salt = salt;
        this.dateOfBirth = dateOfBirth;
        this.roles = roles;
    };

    id = '';
    name = '';
    email = '';
    passwordHashed = '';
    salt = '';
    dateOfBirth = Date;
    roles = [Role];
};

export class GroceryList {
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

export class UnitType {
    constructor(id, name, allowDecimals) {
        this.id = id;
        this.name = name;
        this.allowDecimals = allowDecimals;
    };

    id = '';
    name = '';
    allowDecimals = false;
};

export class IngredientCategory {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    };

    id = '';
    name = '';
};

export class RecipeCategory {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    };

    id = '';
    name = '';
};

export class Ingredient {
    constructor(id, name, categories, unitTypes) {
        this.id = id;
        this.name = name;
        this.categories = categories;
        this.unitTypes = unitTypes;
    };

    id = '';
    name = '';
    categories = [IngredientCategory];
    unitTypes = [UnitType];
};

export class RequirementsListIngredient {
    constructor(id, ingredient, units, unitType, recipe) {
        this.id = id;
        this.ingredient = ingredient;
        this.units = units;
        this.unitType = unitType;
        this.recipe = recipe;
    };

    id = '';
    ingredient = Ingredient;
    units = 0;
    unitType = UnitType;
    recipeId = '';
};

export class Recipe {
    constructor(id, name, categories, requirementsList, user) {
        this.id = id;
        this.name = name;
        this.categories = categories;
        this.requirementsList = requirementsList;
        this.user = user;
    };

    id = '';
    name = '';
    categories = [RecipeCategory];
    requirementsList = [RequirementsListIngredient];
    user = User;
};

export class KitchenIngredient {
    constructor(id, ingredient, units, unitType, user) {
        this.id = id;
        this.ingredient = ingredient;
        this.units = units;
        this.unitType = unitType;
        this.user = user;
    };

    id = '';
    ingredient = Ingredient;
    units = 0;
    unitType = UnitType;
    user = User;
};