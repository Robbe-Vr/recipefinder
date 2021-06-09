import User from "./User"

export default class UserAction {
    constructor(countId, user, endpoint, requestType, description, refObject, actionPerformedOnTable, success) {
        this.CountId = countId ?? -1;
        this.User = user ?? null;
        this.Endpoint = endpoint ?? '';
        this.RequestType = requestType ?? '';
        this.Description = description ?? '';
        this.RefObject = refObject ?? {};
        this.ActionPerformedOnTable = actionPerformedOnTable ?? '';
        this.Success = success ?? false;
    };

    User = new User();
};