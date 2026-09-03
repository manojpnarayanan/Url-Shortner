import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { User } from "../../user/schema/user.schema";
import { UserResponseDto } from "../../user/dto/user.response.dto";


export interface AuthResult{
    token:string;
    user:User |UserResponseDto;
}

export interface IAuthService{
    register(dto:RegisterDto):Promise<AuthResult>;
    login(dto:LoginDto):Promise<AuthResult>;
    getMe(userId:string):Promise<User>;
}