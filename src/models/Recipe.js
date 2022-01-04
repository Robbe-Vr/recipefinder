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

    Validate() {
        var validation = [];

        if (this.Name.length < 1) validation.push({ prop: 'Name', message: 'Please provide a valid name!' });
        if (this.Description.length < 5) validation.push({ prop: 'Description', message: 'Please provide a valid description!' });
        if (this.PreparationSteps.length < 1) validation.push({ prop: 'PreparationSteps', message: 'Please provide valid preparation steps!' });
        if (this.Categories.length < 1) validation.push({ prop: 'Categories', message: 'Please select at least one category!' });
        if (this.RequirementsList.length < 1) validation.push({ prop: 'RequirementsList', message: 'Please select at least one ingredient!' });
        if (this.UserId.length < 1) validation.push({ prop: 'UserId', message: 'Please provide a valid user!' });

        return validation;
    }
};