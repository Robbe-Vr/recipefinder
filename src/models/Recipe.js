import RecipeCategory from "./RecipeCategory"
import RequirementsListIngredient from "./RequirementsListIngredient"
import User from "./User"

export default class Recipe {
    constructor(countId, id, name, description, imageLocation, isPublic, preparationSteps, videoTutorialLink, categories, requirementsList, user) {
        this.CountId = countId ?? -1;
        this.Id = id ?? '';
        this.Name = name ?? '';
        this.Description = description ?? '';
        this.ImageLocation = imageLocation ?? '';
        this.PreparationSteps = preparationSteps ?? '';
        this.VideoTutorialLink = videoTutorialLink ?? '';
        this.IsPublic = isPublic ?? true;
        this.Categories = categories ?? [];
        this.RequirementsList = requirementsList ?? [];
        this.UserId = user?.Id ?? '';
        this.User = user ?? null;
    };

    Categories = [new RecipeCategory()];
    RequirementsList = [new RequirementsListIngredient()];
    User = new User();
};