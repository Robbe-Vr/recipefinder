import { EntityGroup } from "./BaseEntityGroup";

import { IngredientCategory } from "../../models";

export class IngredientCategoryEntityGroup extends EntityGroup {
    constructor() {
        super("IngredientCategories", "IngredientCategories");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new IngredientCategory(item.CountId, item.Name);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = item && item !== "Error" ? new IngredientCategory(item.CountId, item.Name) : null;

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = item && item !== "Error" ? new IngredientCategory(item.CountId, item.Name) : null;

        return fixedData;
    };
};