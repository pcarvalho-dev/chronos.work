import { vi } from 'vitest';
import type { Repository } from 'typeorm';

/**
 * Mock implementations for testing
 */

/**
 * Create a mock TypeORM repository
 */
export const createMockRepository = <T extends Record<string, any>>(): Repository<T> => {
  return {
    find: vi.fn(),
    findOne: vi.fn(),
    findOneBy: vi.fn(),
    findAndCount: vi.fn(),
    save: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    createQueryBuilder: vi.fn(() => ({
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      orWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyAndCount: vi.fn(),
      execute: vi.fn(),
    })),
  } as any;
};

/**
 * Mock Express Request
 */
export const createMockRequest = (overrides = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    file: undefined,
    user: undefined,
    ...overrides,
  } as any;
};

/**
 * Mock Express Response
 */
export const createMockResponse = () => {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    sendStatus: vi.fn().mockReturnThis(),
  };
  return res;
};

/**
 * Mock Express Next function
 */
export const createMockNext = () => vi.fn();

/**
 * Mock nodemailer transporter
 */
export const createMockEmailTransporter = () => ({
  sendMail: vi.fn().mockResolvedValue({
    messageId: 'test-message-id',
    accepted: ['test@example.com'],
    rejected: [],
    response: '250 OK',
  }),
  verify: vi.fn().mockResolvedValue(true),
});

/**
 * Mock Cloudinary upload response
 */
export const createMockCloudinaryResponse = () => ({
  public_id: 'test-public-id',
  version: 1234567890,
  signature: 'test-signature',
  width: 500,
  height: 500,
  format: 'jpg',
  resource_type: 'image',
  created_at: new Date().toISOString(),
  tags: [],
  bytes: 12345,
  type: 'upload',
  etag: 'test-etag',
  placeholder: false,
  url: 'http://res.cloudinary.com/test-cloud/image/upload/v1234567890/test-public-id.jpg',
  secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v1234567890/test-public-id.jpg',
});

/**
 * Mock Nominatim geocoding response
 */
export const createMockGeocodingResponse = (lat: number = -23.5505, lon: number = -46.6333) => ({
  place_id: 123456,
  licence: 'Test Licence',
  osm_type: 'way',
  osm_id: 789012,
  lat: lat.toString(),
  lon: lon.toString(),
  display_name: 'Avenida Paulista, São Paulo, Brasil',
  address: {
    road: 'Avenida Paulista',
    suburb: 'Bela Vista',
    city: 'São Paulo',
    state: 'São Paulo',
    postcode: '01310-100',
    country: 'Brasil',
    country_code: 'br',
  },
  boundingbox: ['-23.5515', '-23.5495', '-46.6343', '-46.6323'],
});

/**
 * Mock TypeORM DataSource
 */
export const createMockDataSource = () => ({
  getRepository: vi.fn(),
  initialize: vi.fn().mockResolvedValue(true),
  destroy: vi.fn().mockResolvedValue(true),
  isInitialized: true,
  createQueryRunner: vi.fn(() => ({
    connect: vi.fn(),
    startTransaction: vi.fn(),
    commitTransaction: vi.fn(),
    rollbackTransaction: vi.fn(),
    release: vi.fn(),
    manager: {
      save: vi.fn(),
      findOne: vi.fn(),
      getRepository: vi.fn(),
    },
  })),
});
