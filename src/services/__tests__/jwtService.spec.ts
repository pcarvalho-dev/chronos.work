import { describe, it, expect, beforeAll } from 'vitest';
import jwt from 'jsonwebtoken';
import { JwtService } from '../jwtService.js';

describe('JwtService', () => {
  const testUserId = 123;
  const testEmail = 'test@example.com';
  const accessSecret = process.env.JWT_ACCESS_SECRET!;
  const refreshSecret = process.env.JWT_REFRESH_SECRET!;

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = JwtService.generateAccessToken(testUserId, testEmail);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include userId and email in token payload', () => {
      const token = JwtService.generateAccessToken(testUserId, testEmail);
      const decoded = jwt.verify(token, accessSecret) as any;

      expect(decoded.userId).toBe(testUserId);
      expect(decoded.email).toBe(testEmail);
    });

    it('should set expiration time (15 minutes)', () => {
      const token = JwtService.generateAccessToken(testUserId, testEmail);
      const decoded = jwt.verify(token, accessSecret) as any;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();

      // Token should expire in approximately 15 minutes (900 seconds)
      const expiresIn = decoded.exp - decoded.iat;
      expect(expiresIn).toBe(900);
    });

    it('should generate different tokens for different users', () => {
      const token1 = JwtService.generateAccessToken(1, 'user1@example.com');
      const token2 = JwtService.generateAccessToken(2, 'user2@example.com');

      expect(token1).not.toBe(token2);
    });

    it('should generate different tokens each time (due to iat)', async () => {
      const token1 = JwtService.generateAccessToken(testUserId, testEmail);

      // Wait 1 second to ensure different iat
      await new Promise(resolve => setTimeout(resolve, 1000));

      const token2 = JwtService.generateAccessToken(testUserId, testEmail);

      expect(token1).not.toBe(token2);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = JwtService.generateRefreshToken(testUserId, testEmail);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include userId and email in token payload', () => {
      const token = JwtService.generateRefreshToken(testUserId, testEmail);
      const decoded = jwt.verify(token, refreshSecret) as any;

      expect(decoded.userId).toBe(testUserId);
      expect(decoded.email).toBe(testEmail);
    });

    it('should set expiration time (7 days)', () => {
      const token = JwtService.generateRefreshToken(testUserId, testEmail);
      const decoded = jwt.verify(token, refreshSecret) as any;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();

      // Token should expire in approximately 7 days (604800 seconds)
      const expiresIn = decoded.exp - decoded.iat;
      expect(expiresIn).toBe(604800);
    });

    it('should use different secret than access token', () => {
      const refreshToken = JwtService.generateRefreshToken(testUserId, testEmail);

      // Should fail to verify with access token secret
      expect(() => {
        jwt.verify(refreshToken, accessSecret);
      }).toThrow();
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify valid access token', () => {
      const token = JwtService.generateAccessToken(testUserId, testEmail);
      const payload = JwtService.verifyAccessToken(token);

      expect(payload).toBeDefined();
      expect(payload.userId).toBe(testUserId);
      expect(payload.email).toBe(testEmail);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        JwtService.verifyAccessToken('invalid.token.here');
      }).toThrow('Invalid or expired access token');
    });

    it('should throw error for malformed token', () => {
      expect(() => {
        JwtService.verifyAccessToken('not-a-jwt-token');
      }).toThrow('Invalid or expired access token');
    });

    it('should throw error for empty token', () => {
      expect(() => {
        JwtService.verifyAccessToken('');
      }).toThrow('Invalid or expired access token');
    });

    it('should throw error for token signed with wrong secret', () => {
      const wrongToken = jwt.sign(
        { userId: testUserId, email: testEmail },
        'wrong-secret',
        { expiresIn: '15m' }
      );

      expect(() => {
        JwtService.verifyAccessToken(wrongToken);
      }).toThrow('Invalid or expired access token');
    });

    it('should throw error for expired token', () => {
      const expiredToken = jwt.sign(
        { userId: testUserId, email: testEmail },
        accessSecret,
        { expiresIn: '-1s' } // Already expired
      );

      expect(() => {
        JwtService.verifyAccessToken(expiredToken);
      }).toThrow('Invalid or expired access token');
    });

    it('should throw error for refresh token (wrong secret)', () => {
      const refreshToken = JwtService.generateRefreshToken(testUserId, testEmail);

      expect(() => {
        JwtService.verifyAccessToken(refreshToken);
      }).toThrow('Invalid or expired access token');
    });

    it('should extract correct payload from token', () => {
      const token = JwtService.generateAccessToken(456, 'another@example.com');
      const payload = JwtService.verifyAccessToken(token);

      expect(payload.userId).toBe(456);
      expect(payload.email).toBe('another@example.com');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify valid refresh token', () => {
      const token = JwtService.generateRefreshToken(testUserId, testEmail);
      const payload = JwtService.verifyRefreshToken(token);

      expect(payload).toBeDefined();
      expect(payload.userId).toBe(testUserId);
      expect(payload.email).toBe(testEmail);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        JwtService.verifyRefreshToken('invalid.token.here');
      }).toThrow('Invalid or expired refresh token');
    });

    it('should throw error for malformed token', () => {
      expect(() => {
        JwtService.verifyRefreshToken('not-a-jwt-token');
      }).toThrow('Invalid or expired refresh token');
    });

    it('should throw error for empty token', () => {
      expect(() => {
        JwtService.verifyRefreshToken('');
      }).toThrow('Invalid or expired refresh token');
    });

    it('should throw error for token signed with wrong secret', () => {
      const wrongToken = jwt.sign(
        { userId: testUserId, email: testEmail },
        'wrong-secret',
        { expiresIn: '7d' }
      );

      expect(() => {
        JwtService.verifyRefreshToken(wrongToken);
      }).toThrow('Invalid or expired refresh token');
    });

    it('should throw error for expired token', () => {
      const expiredToken = jwt.sign(
        { userId: testUserId, email: testEmail },
        refreshSecret,
        { expiresIn: '-1s' } // Already expired
      );

      expect(() => {
        JwtService.verifyRefreshToken(expiredToken);
      }).toThrow('Invalid or expired refresh token');
    });

    it('should throw error for access token (wrong secret)', () => {
      const accessToken = JwtService.generateAccessToken(testUserId, testEmail);

      expect(() => {
        JwtService.verifyRefreshToken(accessToken);
      }).toThrow('Invalid or expired refresh token');
    });

    it('should extract correct payload from token', () => {
      const token = JwtService.generateRefreshToken(789, 'refresh@example.com');
      const payload = JwtService.verifyRefreshToken(token);

      expect(payload.userId).toBe(789);
      expect(payload.email).toBe('refresh@example.com');
    });
  });

  describe('generateTokens', () => {
    it('should generate both access and refresh tokens', () => {
      const tokens = JwtService.generateTokens(testUserId, testEmail);

      expect(tokens).toBeDefined();
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });

    it('should generate valid tokens that can be verified', () => {
      const tokens = JwtService.generateTokens(testUserId, testEmail);

      const accessPayload = JwtService.verifyAccessToken(tokens.accessToken);
      const refreshPayload = JwtService.verifyRefreshToken(tokens.refreshToken);

      expect(accessPayload.userId).toBe(testUserId);
      expect(accessPayload.email).toBe(testEmail);
      expect(refreshPayload.userId).toBe(testUserId);
      expect(refreshPayload.email).toBe(testEmail);
    });

    it('should generate different access and refresh tokens', () => {
      const tokens = JwtService.generateTokens(testUserId, testEmail);

      expect(tokens.accessToken).not.toBe(tokens.refreshToken);
    });

    it('should generate tokens with correct expiration times', () => {
      const tokens = JwtService.generateTokens(testUserId, testEmail);

      const accessDecoded = jwt.verify(tokens.accessToken, accessSecret) as any;
      const refreshDecoded = jwt.verify(tokens.refreshToken, refreshSecret) as any;

      // Access token expires in 15 minutes
      const accessExpiresIn = accessDecoded.exp - accessDecoded.iat;
      expect(accessExpiresIn).toBe(900);

      // Refresh token expires in 7 days
      const refreshExpiresIn = refreshDecoded.exp - refreshDecoded.iat;
      expect(refreshExpiresIn).toBe(604800);
    });

    it('should contain same user data in both tokens', () => {
      const tokens = JwtService.generateTokens(999, 'both@example.com');

      const accessPayload = JwtService.verifyAccessToken(tokens.accessToken);
      const refreshPayload = JwtService.verifyRefreshToken(tokens.refreshToken);

      expect(accessPayload.userId).toBe(refreshPayload.userId);
      expect(accessPayload.email).toBe(refreshPayload.email);
    });
  });

  describe('Security Tests', () => {
    it('should not allow token tampering', () => {
      const token = JwtService.generateAccessToken(testUserId, testEmail);
      const parts = token.split('.');

      // Tamper with the payload
      const tamperedPayload = Buffer.from(JSON.stringify({ userId: 999, email: 'hacker@evil.com' }))
        .toString('base64url');
      const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

      expect(() => {
        JwtService.verifyAccessToken(tamperedToken);
      }).toThrow('Invalid or expired access token');
    });

    it('should not accept tokens without signature', () => {
      const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');
      const payload = Buffer.from(JSON.stringify({ userId: testUserId, email: testEmail })).toString('base64url');
      const unsignedToken = `${header}.${payload}.`;

      expect(() => {
        JwtService.verifyAccessToken(unsignedToken);
      }).toThrow('Invalid or expired access token');
    });

    it('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      const token = JwtService.generateAccessToken(testUserId, longEmail);
      const payload = JwtService.verifyAccessToken(token);

      expect(payload.email).toBe(longEmail);
    });

    it('should handle special characters in email', () => {
      const specialEmail = 'test+alias@example.co.uk';
      const token = JwtService.generateAccessToken(testUserId, specialEmail);
      const payload = JwtService.verifyAccessToken(token);

      expect(payload.email).toBe(specialEmail);
    });

    it('should handle very large user IDs', () => {
      const largeUserId = 2147483647; // Max 32-bit integer
      const token = JwtService.generateAccessToken(largeUserId, testEmail);
      const payload = JwtService.verifyAccessToken(token);

      expect(payload.userId).toBe(largeUserId);
    });
  });
});
