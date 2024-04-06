import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class ExportService {
  constructor(private readonly userService: UserService) {}

  async exportUserData(userId: string) {
    const data = await this.userService.getUserData(userId);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, password, role, list, movie, ...userData } = data;

    const exportData = {
      ...userData,
      lists: list,
      watched: movie,
    };

    return exportData;
  }
}
