import { Injectable ,Inject } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from '../user/schema/user.schema';
import { IUserService } from "./interface/IUserService";
import { IUserRepository } from "./interface/IUserRepository";



@Injectable()
export class UserService implements IUserService{
    constructor(
        @Inject('IUserRepository') private readonly userRepo:IUserRepository
    ){}
    async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }
  async findById(id: string): Promise<User | null> {
    return this.userRepo.findById(id);
  }
  async create(email: string, passwordHash: string): Promise<User> {
    return this.userRepo.create({
      email,
      password: passwordHash,
    });
  } 
}