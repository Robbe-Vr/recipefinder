import { EntityGroup } from "./BaseEntityGroup";

import { UnitType } from "../../models";

export class UnitTypeEntityGroup extends EntityGroup {
    constructor() {
        super("UnitTypes", "UnitTypes");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new UnitType(item.CountId, item.Name, item.AllowDecimals);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new UnitType(item.CountId, item.Name, item.AllowDecimals);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new UnitType(item.CountId, item.Name, item.AllowDecimals);

        return fixedData;
    };
};