import { Ingredient, IngredientCategory, Recipe, RecipeCategory, UnitType } from "../models";

class CRUDPagesInformation {
    Pages = [
        {
            Name: 'Ingredients',
            DisplayName: 'Ingredients',
            notEditableProperties: [
                "Id",
            ],
        },
        {
            Name: 'IngredientCategories',
            DisplayName: 'Ingredient Categories',
            notEditableProperties: [
                "CountId",
            ],
        },
        {
            Name: 'UnitTypes',
            DisplayName: 'Unit Types',
            notEditableProperties: [
                "CountId",
            ],
        },
        {
            Name: 'Recipes',
            DisplayName: 'Recipes',
            notEditableProperties: [
                "Id",
            ],
        },
        {
            Name: 'RecipeCategories',
            DisplayName: 'Recipe Categories',
            notEditableProperties: [
                "CountId",
            ],
        },
    ]
};

const CRUDPagesInfo = new CRUDPagesInformation()

export default CRUDPagesInfo;