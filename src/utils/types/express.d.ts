import { Request } from 'express';
import User from '../entities/User';

declare module 'express' {
  interface Request {
    user?: Partial<User>;
  }
}
