class UserDTO {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.nombreCompleto = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.role = user.role;
        this.age = user.age;
    }
}

export default UserDTO;