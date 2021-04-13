export default class Recipe {
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