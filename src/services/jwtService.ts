import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret';

// Access token expires in 15 minutes
const ACCESS_TOKEN_EXPIRY = '15m';
// Refresh token expires in 7 days
const REFRESH_TOKEN_EXPIRY = '7d';

interface TokenPayload {
    userId: number;
    email: string;
}

export class JwtService {
    /**
     * Generate access token
     */
    static generateAccessToken(userId: number, email: string): string {
        const payload: TokenPayload = { userId, email };
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    }

    /**
     * Generate refresh token
     */
    static generateRefreshToken(userId: number, email: string): string {
        const payload: TokenPayload = { userId, email };
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    }

    /**
     * Verify access token
     */
    static verifyAccessToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid or expired access token');
        }
    }

    /**
     * Verify refresh token
     */
    static verifyRefreshToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }

    /**
     * Generate both access and refresh tokens
     */
    static generateTokens(userId: number, email: string) {
        return {
            accessToken: this.generateAccessToken(userId, email),
            refreshToken: this.generateRefreshToken(userId, email),
        };
    }
}
