import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { IHashingService } from "./Ihashing-service";


@Injectable()
export class BcryptService implements IHashingService{
    private _saltRounds=10;

    async hash(plainText: string): Promise<string> {
        return bcrypt.hash(plainText,this._saltRounds);
    }
    async compare(plainText: string, hashedText: string): Promise<boolean> {
        return bcrypt.compare(plainText,hashedText)
    }
}