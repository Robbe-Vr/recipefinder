import { EntityGroup } from "./BaseEntityGroup";

import { Role, User, UserAction } from "../../models";

export class UserEntityGroup extends EntityGroup {
    constructor() {
        super("Users", "Users");
    };

    async GetAll() {
        var data = await super.GetAll();

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new User(item.CountId, item.Id, item.Name, item.Email, item.PhoneNumber, item.PasswordHashed, item.Salt, item.DOB, item.CreationDate,
                item.Roles ? item.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []);
        }) : [];

        return fixedData;
    };

    async GetById(id) {
        var item = await super.GetById(id);

        const fixedData = item && item !== "Error" ? new User(item.CountId, item.Id, item.Name, item.Email, item.PhoneNumber, item.PasswordHashed, item.Salt, item.DOB, item.CreationDate,
            item.Roles ? item.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []) : null;

        return fixedData;
    };

    async GetByName(name) {
        var item = await super.GetByName(name);

        const fixedData = item && item !== "Error" ? new User(item.CountId, item.Id, item.Name, item.Email, item.PhoneNumber, item.PasswordHashed, item.Salt, item.DOB, item.CreationDate,
            item.Roles ? item.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []) : null;

        return fixedData;
    };

    async GetActionsByUserId(id) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/' + id + "/actions");

        const fixedData = res.data && res !== "Error" && res.data.map ? res.data.map((item) => {
            return new UserAction(item.CountId,
                new User(item.User.CountId, item.User.Id, item.User.Name, item.User.Email, item.User.PhoneNumber, item.User.PasswordHashed, item.User.Salt, item.User.DOB, item.User.CreationDate,
                    item.User.Roles ? item.User.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []),
                item.Endpoint, item.RequestType, item.Description, item.RefObject ? item.RefObject : { Id: item.RefObjectid, Name: item.RefObjectName }, item.ActionPerformedOnTable, item.Success );
        }) : [];

        return fixedData;
    };

    async GetRolesByUserId(id) {
        var data = await super.PerformCustom('get', this.ApiUrl + '/getroles/' + id);

        const fixedData = data && data !== "Error" && data.map ? data.map((item) => {
            return new Role(item.CountId, item.Id, item.Name);
        }) : [];

        return fixedData;
    };
};