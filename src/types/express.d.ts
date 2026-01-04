import {UserDTO} from "../path/to/dtos";

declare global {
    namespace Express {
        interface Request {
            // Match the actual runtime object logged in your console
            user: UserDTO;
        }
    }
}

export {};