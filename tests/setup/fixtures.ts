import { faker } from '@faker-js/faker';
import type { User } from '../../src/models/User.js';
import type { UserCheckIn } from '../../src/models/UserCheckIn.js';
import type { Company } from '../../src/models/Company.js';
import type { Invitation } from '../../src/models/Invitation.js';

/**
 * Test data fixtures for creating mock objects
 */

export const createMockUser = (overrides?: Partial<User>): User => {
  const now = new Date();
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    cpf: faker.string.numeric(11),
    rg: faker.string.numeric(9),
    birthDate: faker.date.past({ years: 30 }),
    gender: faker.helpers.arrayElement(['male', 'female', 'other']),
    maritalStatus: faker.helpers.arrayElement(['single', 'married', 'divorced', 'widowed']),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    country: 'Brasil',
    employeeId: faker.string.alphanumeric(6).toUpperCase(),
    department: faker.helpers.arrayElement(['TI', 'RH', 'Financeiro', 'Vendas']),
    position: faker.person.jobTitle(),
    hireDate: faker.date.past({ years: 5 }),
    salary: faker.number.float({ min: 2000, max: 15000, fractionDigits: 2 }),
    workSchedule: '08:00-17:00',
    bankName: faker.company.name(),
    bankAccount: faker.finance.accountNumber(),
    pix: faker.internet.email(),
    emergencyContactName: faker.person.fullName(),
    emergencyContactPhone: faker.phone.number(),
    emergencyContactRelation: faker.helpers.arrayElement(['Pai', 'Mãe', 'Cônjuge', 'Irmão']),
    profilePhoto: faker.image.avatar(),
    refreshToken: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    role: 'employee',
    isApproved: true,
    companyId: null,
    company: null,
    timeLogs: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  } as User;
};

export const createMockManager = (overrides?: Partial<User>): User => {
  return createMockUser({
    role: 'manager',
    isApproved: true,
    companyId: faker.number.int({ min: 1, max: 100 }),
    ...overrides,
  });
};

export const createMockTimeLog = (overrides?: Partial<UserCheckIn>): UserCheckIn => {
  const checkInDate = faker.date.recent({ days: 7 });
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    userId: faker.number.int({ min: 1, max: 100 }),
    user: null as any,
    checkIn: checkInDate,
    checkOut: faker.date.soon({ days: 1, refDate: checkInDate }),
    checkInPhoto: faker.image.url(),
    checkOutPhoto: faker.image.url(),
    checkInLocation: `${faker.location.latitude()}, ${faker.location.longitude()}`,
    checkOutLocation: `${faker.location.latitude()}, ${faker.location.longitude()}`,
    checkInAddress: faker.location.streetAddress(),
    checkOutAddress: faker.location.streetAddress(),
    isManual: false,
    approvalStatus: 'approved',
    managerNotes: null,
    createdAt: checkInDate,
    updatedAt: checkInDate,
    ...overrides,
  } as UserCheckIn;
};

export const createMockCompany = (overrides?: Partial<Company>): Company => {
  const now = new Date();
  return {
    id: faker.number.int({ min: 1, max: 100 }),
    name: faker.company.name(),
    cnpj: faker.string.numeric(14),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    employees: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  } as Company;
};

export const createMockInvitation = (overrides?: Partial<Invitation>): Invitation => {
  const now = new Date();
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    code: faker.string.alphanumeric(8).toUpperCase(),
    email: faker.internet.email(),
    companyId: faker.number.int({ min: 1, max: 100 }),
    company: null as any,
    createdById: faker.number.int({ min: 1, max: 100 }),
    createdBy: null as any,
    status: 'pending',
    expiresAt: faker.date.future(),
    usedAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  } as Invitation;
};

/**
 * Create valid login credentials
 */
export const createLoginData = () => ({
  email: faker.internet.email(),
  password: 'Password123!',
});

/**
 * Create valid registration data
 */
export const createRegisterData = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: 'Password123!',
  cpf: faker.string.numeric(11),
  phone: faker.phone.number(),
  invitationCode: faker.string.alphanumeric(8).toUpperCase(),
});

/**
 * Create valid manager registration data
 */
export const createManagerRegisterData = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: 'Password123!',
  cpf: faker.string.numeric(11),
  phone: faker.phone.number(),
  companyName: faker.company.name(),
  companyCnpj: faker.string.numeric(14),
  companyAddress: faker.location.streetAddress(),
  companyCity: faker.location.city(),
  companyState: faker.location.state(),
  companyZipCode: faker.location.zipCode(),
  companyPhone: faker.phone.number(),
  companyEmail: faker.internet.email(),
});

/**
 * Create JWT payload
 */
export const createJwtPayload = (userId: number, email: string) => ({
  userId,
  email,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 900, // 15 minutes
});
