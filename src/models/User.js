import Role from "./Role"

export default class User {
    constructor(countId, id, name, email, phoneNumber, passwordHashed, salt, dateOfBirth, creationDate, roles) {
        this.CountId = countId ? countId : this.CountId;
        this.Id = id ? id : this.Id;
        this.Name = name ? name : this.Name;
        this.Email = email ? email : this.Email;
        this.PhoneNumber = phoneNumber ? phoneNumber : this.PhoneNumber;
        this.PasswordHashed = passwordHashed ? passwordHashed : this.PasswordHashed;
        this.Salt = salt ? salt : this.Salt;
        this.DateOfBirth = dateOfBirth ? new Date(Date.parse(dateOfBirth)) : this.DateOfBirth;
        this.CreationDate = creationDate ? new Date(Date.parse(creationDate)) : this.CreationDate;
        this.Roles = roles ?? [];
    };

    CountId = '';
    Id = '';
    Name = '';
    Email = '';
    PhoneNumber = '';
    PasswordHashed = '';
    Salt = '';
    DateOfBirth = new Date();
    CreationDate = new Date();
    Roles = [new Role()];
};