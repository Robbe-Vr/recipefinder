import User from "./User"

export default class UserAction {
    constructor(countId, user, endpoint, requestType, description, refObject, actionPerformedOnTable, success) {
        this.CountId = countId ? countId : this.CountId;
        this.User = user ? user : this.User;
        this.Endpoint = endpoint ? endpoint : this.Endpoint;
        this.RequestType = requestType ? requestType : this.RequestType;
        this.Description = description ? description : this.Description;
        this.RefObject = refObject ? refObject : this.RefObject;
        this.ActionPerformedOnTable = actionPerformedOnTable ? actionPerformedOnTable : this.ActionPerformedOnTable;
        this.Success = success ? success : this.Success;
    };

    CountId = -1;
    User = new User();
    Endpoint = '';
    RequestType = '';
    Description = '';
    RefObject = {};
    ActionPerformedOnTable = '';
    Success = false;
};