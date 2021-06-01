import { EntityGroup } from "./BaseEntityGroup";

import { Role, User } from "../../models";

export class CustomEntityGroup extends EntityGroup {
    constructor() {
        super("Custom", "");
    };

    async Encrypt(text, salt) {
        var res = await super.PerformCustom('post', this.ApiUrl + '/Encrypt', { Text: text, Salt: salt });

        if (res.error) {
            return "Error";
        }

        return res.data.Result;
    };

    async GetSalt() {
        var res = await super.PerformCustom('get', this.ApiUrl + '/Encrypt/getsalt');

        if (res.error) {
            return "Error";
        }

        return res.data.Result;
    };

    async LogOut(headers) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/Authorize/logout?show', null, headers);

        if (res.error) {
            return "Error";
        }

        return res.data;
    };

    async ValidateAccessToken(headers) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/Authorize/Validate', null, headers);

        if (res.error) {
            return "Error";
        }

        return res.data;
    };

    async RefreshAccessToken(headers) {
        var res = await super.PerformCustom('post', this.ApiUrl + '/Authorize/Refresh', null, headers);

        if (res.error) {
            return "Error";
        }

        return res.data;
    };

    async GetUserByAccessToken(headers) {
        var res = await super.PerformCustom('get', this.ApiUrl + '/Authorize/Me', null, headers);

        if (res.error) {
            return "Error";
        }

        const item = res.data;

        return new User(item.CountId, item.Id, item.Name, item.Email, item.PhoneNumber, item.PasswordHashed, item.Salt, item.DOB, item.CreationDate,
            item.Roles ? item.Roles.map(role => new Role(role.CountId, role.Id, role.Name)) : []);
    };
};