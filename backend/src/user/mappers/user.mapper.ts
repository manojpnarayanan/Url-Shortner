import { User } from '../schema/user.schema';
import { UserResponseDto } from '../dto/user.response.dto';

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return new UserResponseDto({
      id: user._id.toString(),
      email: user.email,
      createdAt: user.createdAt ?? new Date(),
    });
  }
}
