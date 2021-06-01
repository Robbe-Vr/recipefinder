import { EntityGroup } from "./BaseEntityGroup";

import { Role } from "../../models";

export class RoleEntityGroup extends EntityGroup {
    constructor() {
        super("Roles", "Roles");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new Role(item.CountId, item.Id, item.Name);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new Role(item.CountId, item.Id, item.Name);

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new Role(item.CountId, item.Id, item.Name);

        return fixedData;
    };
};