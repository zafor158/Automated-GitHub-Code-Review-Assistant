import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Verify GitHub webhook signature
 * @param payload - The raw request body
 * @param signature - The X-Hub-Signature-256 header value
 * @param secret - The webhook secret
 * @returns boolean indicating if signature is valid
 */
export function verifyGitHubSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false;
  }

  // Remove 'sha256=' prefix if present
  const cleanSignature = signature.replace('sha256=', '');
  
  // Create expected signature
  const expectedSignature = createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');

  // Convert both to buffers for comparison
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  const receivedBuffer = Buffer.from(cleanSignature, 'hex');

  // Use timing-safe comparison to prevent timing attacks
  return expectedBuffer.length === receivedBuffer.length &&
         timingSafeEqual(expectedBuffer, receivedBuffer);
}
