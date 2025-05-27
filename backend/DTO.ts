export class User {//this is a user object
    public role: string;
    public firstName: string;
    public lastName: string;
    private username: string;
    private password: string;
    public Files: File[] = [];
    public Users: User[] = [];

    constructor(role: string,firstName: string, lastName: string, username: string, password: string) {
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;//security risk probably
    }

    public getUsername(): string {
        return this.username;
    }
    public getPassword(): string {
        return this.password;
    }

    //takes in a string and returns the old password
    //this is a security risk, but it is for testing purposes
    public setPassword(password: string): String {
        const tempPass = this.password;
        this.password = password;
        return tempPass;
    }

    public addFiles(file: File): void {
        this.Files.push(file);
    }
    public addUsers(user: User): void {
        this.Users.push(user);
    }

    
}

//this is a file object
export class File {
    public name: string;
    public description: string;
    public type: string;
    public dueDate: string;
    public isRequested: boolean;
    public pdf: string;
    public id: number;
    public requestedBy: User;
    public requestedFor: User;

    constructor(name: string, description: string, type: string, dueDate: string, isRequested: boolean, pdf: string, id: number, requestedBy: User, requestedFor: User) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.dueDate = dueDate;
        this.isRequested = isRequested;
        this.pdf = pdf;
        this.id = id;
        this.requestedBy = requestedBy;
        this.requestedFor = requestedFor;//in the backend this will not be a user object, but a string for the username instead.
    }

    public getRawFile(): string {//idk what data type this is yet
        return "this should return the raw file";
    }

}
//this is an attribute pair object
//this is used to store the key and value of an attribute
export class AttributePair<T> {
    public key: string;
    public value: T;
    constructor(key: string, value: T) {
        this.key = key;
        this.value = value;
    }
}