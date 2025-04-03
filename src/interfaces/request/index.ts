import { Request } from 'express';
import { UserDocument } from '../models/user.interface';

export interface AuthenticatedRequest extends Request {
  user: UserDocument;
}
