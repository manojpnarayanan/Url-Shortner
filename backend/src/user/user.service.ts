import { Injectable ,Inject } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from '../user/schema/user.schema';
import { IUserService } from "./interface/IUserService";
import { IUserRepository } from "./interface/IUserRepository";



@Injectable()
export class UserService implements IUserService{
    constructor(
        @Inject('IUserRepository') private readonly _userRepo:IUserRepository
    ){}
    async findByEmail(email: string): Promise<User | null> {
    return this._userRepo.findByEmail(email);
  }
  async findById(id: string): Promise<User | null> {
    return this._userRepo.findById(id);
  }
  async create(email: string, passwordHash: string): Promise<User> {
    return this._userRepo.create({
      email,
      password: passwordHash,
    });
  } 
}