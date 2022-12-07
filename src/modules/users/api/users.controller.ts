import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UsersService } from '../application/users.service';
import { UserUpdateInputModel } from './model/user-update.model';
import { UserInputModel } from './model/user.model';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createParams: UserInputModel) {
    return await this.usersService.createUser(createParams);
  }

  @Get()
  async getUser(@GetCurrentUserId() id: string) {
    return await this.usersService.getUser(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateParams: UserUpdateInputModel,
  ) {
    return await this.usersService.updateUserById(id, updateParams);
  }
}
