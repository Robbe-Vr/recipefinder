import User from "./User"

export default class UserAction {
    constructor(countId, user, endpoint, requestType, description, refObject, actionPerformedOnTable, success) {
        this.CountId = countId ?? -1;
        this.User = user ?? null;
        this.UserId = user?.CountId ?? -1;
        this.Endpoint = endpoint ?? '';
        this.RequestType = requestType ?? '';
        this.Description = description ?? '';
        this.RefObject = refObject ?? {};
        this.ActionPerformedOnTable = actionPerformedOnTable ?? '';
        this.Success = success ?? false;
    };

    User = new User();

    Validate() {
        var validation = [];

        if (this.UserId < 1) validation.push({ prop: 'UserId', message: 'Invalid user supplied!' });
        if (this.Endpoint.length < 0) validation.push({ prop: 'Endpoint', message: 'Invalid endpoint supplied!' });
        if (this.RequestType.length < 0) validation.push({ prop: 'RequestType', message: 'Invalid request type supplied!' });
        if (this.Description.length < 5) validation.push({ prop: 'Description', message: 'Invalid description supplied!' });
        if (this.ActionPerformedOnTable.length < 0) validation.push({ prop: 'ActionPerformedOnTable', message: 'Invalid table supplied!' });

        return validation;
    }
};