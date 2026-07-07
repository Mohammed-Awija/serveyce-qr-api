import { Module, Global, forwardRef } from '@nestjs/common';
import { ClerkService } from './clerk.service';
import { ClerkAuthGuard } from './clerk-auth.guard';
import { TenantService } from './tenant.service';
import { TenantGuard } from './tenant.guard';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [ClerkService, ClerkAuthGuard, TenantService, TenantGuard],
  exports: [ClerkService, ClerkAuthGuard, TenantService, TenantGuard],
})
export class AuthModule {}
