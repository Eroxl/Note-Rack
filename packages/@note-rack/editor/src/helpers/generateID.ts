import crypto from 'crypto';

/**
 * Generate a random ID for a block.
 */
const generateID = () => crypto.randomBytes(12).toString('hex');

export default generateID;
