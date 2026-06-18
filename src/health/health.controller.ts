import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    let dbStatus = 'ok';
    let organizationCount = 0;

    try {
      organizationCount = await this.prisma.organization.count();
    } catch (error) {
      dbStatus = 'error';
    }

    return {
      status: dbStatus === 'ok' ? 'ok' : 'degraded',
      service: 'bambyce-serve-api',
      database: dbStatus,
      organizationCount,
      timestamp: new Date().toISOString(),
    };
  }
}