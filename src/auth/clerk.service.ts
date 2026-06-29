import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createClerkClient,
  verifyToken as clerkVerifyToken,
  ClerkClient,
} from '@clerk/backend';

@Injectable()
export class ClerkService {
  public readonly client: ClerkClient;
  private readonly secretKey?: string;

  constructor(private readonly config: ConfigService) {
    this.secretKey = this.config.get<string>('CLERK_SECRET_KEY');
    this.client = createClerkClient({
      secretKey: this.secretKey,
      publishableKey: this.config.get<string>('CLERK_PUBLISHABLE_KEY'),
    });
  }

  // Verifies a Clerk session JWT (JWKS signature check) and returns its payload.
  verifyToken(token: string): ReturnType<typeof clerkVerifyToken> {
    return clerkVerifyToken(token, { secretKey: this.secretKey });
  }
}
