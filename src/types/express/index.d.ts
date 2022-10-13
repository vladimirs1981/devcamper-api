import { TUser } from '../../controllers/auth-controller';
import { User } from '../../models/User';

// to make the file a module and avoid the TypeScript error
export {};

declare global {
	namespace Express {
		export interface Response {
			advancedResults?: {};
		}

		export interface Request {
			user: User;
		}
	}
}
