import crypto from 'crypto';

export function fingerprintBuffer(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
