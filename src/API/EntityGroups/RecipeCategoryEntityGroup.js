import { EntityGroup } from "./BaseEntityGroup";

import { RecipeCategory } from "../../models";

export class RecipeCategoryEntityGroup extends EntityGroup {
    constructor() {
        super("RecipeCategories", "RecipeCategories");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new RecipeCategory(item.CountId, item.Name);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new RecipeCategory(item.CountId, item.Name);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new RecipeCategory(item.CountId, item.Name);

        return fixedData;
    };
};