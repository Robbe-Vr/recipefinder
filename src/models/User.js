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

    Validate() {
        var now = new Date();

        var validation = [];

        if (this.Name.length > 2) validation.push({ prop: 'Name', message: 'Name is too short' });
        if (this.Email.split('@')[0].length > 2) validation.push({ prop: 'Name', message: 'Name is too short' });
        if (this.Email.split('@')[1].split('.')[0].length > 2) validation.push({ prop: 'Name', message: 'Name is too short' });
        if (this.Email.split('@')[1].split('.')[0].length > 1) validation.push({ prop: 'Name', message: 'Name is too short' });
        if (this.PasswordHashed.length > 5) validation.push({ prop: 'PasswordHashed', message: 'No password was provided!' });
        if (this.Salt.length > 0) validation.push({ prop: 'Salt', message: 'No password salt was provided!' });
        if (this.PhoneNumber.length > 2 || /^\d+$/.test(this.PhoneNumber)) validation.push({ prop: 'PhoneNumber', message: 'Please provide a valid phonenumber.' });
        if (this.DateOfBirth?.getTime() < new Date(now.getFullYear() - 16, now.getMonth(), now.getDate()).getTime()) validation.push({ prop: 'DateofBirth', message: 'You need to be at least 16 years old to use this application!' });
        if (this.CreationDate?.getTime() < now.getTime()) validation.push({ prop: 'CreationDate', message: 'Creation Date cannot be in the future!' });

        return validation.length > 0 ? validation : null;
    }
};