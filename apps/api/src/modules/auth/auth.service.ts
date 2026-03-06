import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

  async register(data: { email: string; password: string; name?: string }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictException('邮箱已被注册');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
    });

    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'free',
        status: 'active',
        dailyNotificationLimit: 5,
        maxTasks: 3,
      },
    });

    const token = this.generateToken(user.id);
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const token = this.generateToken(user.id);
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  async getProfile(authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('未授权');

    const payload: any = jwt.verify(token, this.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { subscription: true },
    });

    if (!user) throw new UnauthorizedException('用户不存在');
    return { id: user.id, email: user.email, name: user.name, subscription: user.subscription };
  }

  private generateToken(userId: string) {
    return jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: '7d' });
  }
}
