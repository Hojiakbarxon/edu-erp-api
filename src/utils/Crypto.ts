import * as bcrypt from "bcrypt"

export class Crypto {
    static async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 7)
    }
    static async compare(password: string, hashedData: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedData)
    }
}