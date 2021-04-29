import RecipeCategory from "./RecipeCategory"
import RequirementsListIngredient from "./RequirementsListIngredient"
import User from "./User"

export default class Recipe {
    constructor(id, name, categories, requirementsList, user) {
        this.Id = id ?? '';
        this.Name = name ?? '';
        this.Categories = categories ?? [];
        this.RequirementsList = requirementsList ?? [];
        this.userId = user?.Id ?? '';
        this.User = user ?? new User();
    };

    Id = '';
    Name = '';
    Categories = [RecipeCategory];
    RequirementsList = [RequirementsListIngredient];
    UserId = '';
    User = User;
};