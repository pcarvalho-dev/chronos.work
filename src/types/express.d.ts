import { User } from '../models/User'; 

declare global {
  namespace Express {
    export interface Request {
      // Adiciona as propriedades do Passport.js
      isAuthenticated?(): boolean;
      user?: User; 
    }
  }
}

export {};