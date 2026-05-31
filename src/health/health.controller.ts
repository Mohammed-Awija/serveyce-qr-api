import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    let dbStatus = 'ok';
    let hotelCount = 0;

    try {
      hotelCount = await this.prisma.hotel.count();
    } catch (error) {
      dbStatus = 'error';
    }

    return {
      status: dbStatus === 'ok' ? 'ok' : 'degraded',
      service: 'roomservice-api',
      database: dbStatus,
      hotelCount,
      timestamp: new Date().toISOString(),
    };
  }
}