const bcrypt = require('bcrypt');
const saltRounds = 10;

export const hashPasswordHelper = async (plainPassword: string): Promise<string> => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Error hashing password');
        
    }
};

export const comaprePasswordHelper = async (plainPassword: string, hashPassword: string): Promise<string> => {
    try {
        return await bcrypt.compare(plainPassword, hashPassword);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Error hashing password');
        
    }
};
