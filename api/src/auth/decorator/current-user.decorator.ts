import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../../user/dto/user.dto';

const getCurrentUserByContext = (context: ExecutionContext): UserDto => {
  const { user } = context.switchToHttp().getRequest();

  return user as UserDto;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
