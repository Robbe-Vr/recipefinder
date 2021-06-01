import { EntityGroup } from "./BaseEntityGroup";

import { GroceryList, User, Role } from "../../models";

export class GroceryListEntityGroup extends EntityGroup {
    constructor() {
        super("GroceryLists", "GroceryLists");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new GroceryList(item.CountId, item.Name, item.Value,
                new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt,
                    item.User.DOB, item.User.CreationDate,
                    item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));
        }) : [];

        return fixedData;
    };

    async GetAllByUserId(id) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/byuserid/' + id);

        const fixedData = res.data && res !== "Error" && res.data.map ? res.data.map((item) => {
            return new GroceryList(item.CountId, item.Name, item.Value,
                new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt,
                    item.User.DOB, item.User.CreationDate,
                    item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = new GroceryList(item.CountId, item.Name, item.Value,
            new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt,
                item.User.DOB, item.User.CreationDate,
                item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = new GroceryList(item.CountId, item.Name, item.Value,
            new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt,
                item.User.DOB, item.User.CreationDate,
                item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []));

        return fixedData;
    };
};