import { Controller, Get, Put, Body, Param, Request } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('users')
export class UsersController {
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { subscription: true },
    });

    if (!user) {
      return { error: '用户不存在' };
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      subscription: user.subscription,
    };
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
  }
}
