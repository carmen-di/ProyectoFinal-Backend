export class User {
    constructor({ email, password, first_name, last_name, age, role, last_connection }) {
        this.first_name= first_name
        this.last_name = last_name
        this.email = email
        this.age = age
        this.role = role
        this.password = password
        this.last_connection = last_connection
    }
}