import Role from "./Role"

export default class User {
    constructor(countId, id, name, email, phoneNumber, passwordHashed, salt, dateOfBirth, creationDate, roles) {
        this.CountId = countId ?? -1;
        this.Id = id ?? '';
        this.Name = name ?? '';
        this.Email = email ?? '';
        this.PhoneNumber = phoneNumber ?? '';
        this.PasswordHashed = passwordHashed ?? '';
        this.Salt = salt ?? '';
        this.DateOfBirth = dateOfBirth ? new Date(Date.parse(dateOfBirth)) : null;
        this.CreationDate = creationDate ? new Date(Date.parse(creationDate)) : null;
        this.Roles = roles ?? [];
    };
    
    Roles = [new Role()];
};