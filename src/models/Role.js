export default class Role {
    constructor(countId, id, name) {
        this.CountId = countId ?? -1;
        this.Id = id ?? '';
        this.Name = name ?? '';
    };
};