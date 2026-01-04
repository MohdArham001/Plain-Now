import crypto from 'crypto';

// Using native crypto for no-dependency hashing (scrypt)
export const hashPassword = (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex');
        crypto.scrypt(password, salt, 64, (err: Error | null, derivedKey: Buffer) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString('hex'));
        });
    });
};

export const verifyPassword = (password: string, hash: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(':');
        crypto.scrypt(password, salt, 64, (err: Error | null, derivedKey: Buffer) => {
            if (err) reject(err);
            resolve(key === derivedKey.toString('hex'));
        });
    });
};
