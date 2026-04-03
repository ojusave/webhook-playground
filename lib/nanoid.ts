import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

export const createEndpointId = customAlphabet(alphabet, 8);
