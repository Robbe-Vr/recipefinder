import RecipeCategory from "./RecipeCategory"
import RequirementsListIngredient from "./RequirementsListIngredient"
import User from "./User"

export default class Recipe {
    constructor(countId, id, name, categories, requirementsList, user) {
        this.CountId = countId ?? -1;
        this.Id = id ?? '';
        this.Name = name ?? '';
        this.Categories = categories ?? [];
        this.RequirementsList = requirementsList ?? [];
        this.UserId = user?.Id ?? '';
        this.User = user ?? new User();
    };

    Categories = [new RecipeCategory()];
    RequirementsList = [new RequirementsListIngredient()];
    User = new User();
};