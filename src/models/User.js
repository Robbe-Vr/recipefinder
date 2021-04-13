export default class User {
    constructor(id, name, email, passwordHashed, salt, dateOfBirth, roles) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHashed = passwordHashed;
        this.salt = salt;
        this.dateOfBirth = dateOfBirth;
        this.roles = roles;
    };

    id = '';
    name = '';
    email = '';
    passwordHashed = '';
    salt = '';
    dateOfBirth = Date;
    roles = [Role];
};