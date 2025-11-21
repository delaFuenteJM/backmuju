import User from '../models/user.js';

class UserDao {
    async getByEmail(email) {
        return await User.findOne({ email }).lean();
    }

    async getById(id) {
        return await User.findById(id).lean();
    }

    async create(userData) {
        return await User.create(userData);
    }

    async updatePassword(id, hashedPassword) {
        return await User.findByIdAndUpdate(
            id, 
            { password: hashedPassword }, 
            { new: true }
        );
    }
    
    async update(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true });
    }
}

export default UserDao;