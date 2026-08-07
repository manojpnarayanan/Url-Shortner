import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schema/user.schema";
import { BaseRepository } from "../common/repository/base.repository";
import { IUserRepository } from "./interface/IUserRepository";


@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository{
    constructor(@InjectModel(User.name) private userModel:Model<User>){super(userModel)}
    async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}