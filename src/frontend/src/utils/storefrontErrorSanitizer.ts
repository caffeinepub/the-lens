/**
 * Centralized error sanitization for public storefront browsing queries.
 * Detects stopped-canister replica rejections and other technical errors,
 * mapping them to user-friendly English messages.
 */

interface SanitizedError extends Error {
  originalMessage?: string;
}

/**
 * Detects if an error is a stopped-canister replica rejection (IC0508).
 */
function isStoppedCanisterError(error: Error): boolean {
  const message = error.message || '';
  
  // Check for IC0508 error code
  if (message.includes('IC0508')) return true;
  
  // Check for reject code 5 (canister error)
  if (message.includes('Reject code: 5')) return true;
  
  // Check for stopped canister text
  if (message.includes('is stopped')) return true;
  if (message.includes('CallContextManager')) return true;
  
  return false;
}

/**
 * Detects if an error message contains technical replica rejection details.
 */
function isReplicaRejectionError(error: Error): boolean {
  const message = error.message || '';
  
  // Check for replica rejection patterns
  if (message.includes('replica returned a rejection')) return true;
  if (message.includes('Request ID:')) return true;
  if (message.includes('Reject code:')) return true;
  if (message.includes('Reject text:')) return true;
  if (message.includes('__principal__')) return true;
  if (message.includes('CBOR') || message.includes('cbor')) return true;
  if (message.includes('HTTP details:')) return true;
  
  return false;
}

/**
 * Sanitizes backend errors for public storefront browsing.
 * Maps stopped-canister and replica rejection errors to friendly English messages.
 */
export function sanitizeStorefrontError(error: Error | null | undefined): Error | null {
  if (!error) return null;
  
  // Check for stopped canister first (most specific)
  if (isStoppedCanisterError(error)) {
    const sanitized: SanitizedError = new Error(
      'The store service is temporarily unavailable. Please try again in a moment.'
    );
    sanitized.name = 'ServiceUnavailableError';
    sanitized.originalMessage = error.message;
    return sanitized;
  }
  
  // Check for other replica rejection errors
  if (isReplicaRejectionError(error)) {
    const sanitized: SanitizedError = new Error(
      'Unable to connect to the store. Please try again.'
    );
    sanitized.name = 'ConnectionError';
    sanitized.originalMessage = error.message;
    return sanitized;
  }
  
  // For other errors, check if they're user-friendly already
  const message = error.message || '';
  
  // If the message is very long or contains technical jargon, sanitize it
  if (message.length > 200 || 
      message.includes('canister') || 
      message.includes('principal') ||
      message.includes('trap')) {
    const sanitized: SanitizedError = new Error(
      'An error occurred while loading products. Please try again.'
    );
    sanitized.name = error.name;
    sanitized.originalMessage = error.message;
    return sanitized;
  }
  
  // Return the original error if it's already user-friendly
  return error;
}

/**
 * Wraps an async function to automatically sanitize errors.
 */
export function withErrorSanitization<T>(
  fn: () => Promise<T>
): () => Promise<T> {
  return async () => {
    try {
      return await fn();
    } catch (error) {
      const sanitized = sanitizeStorefrontError(error as Error);
      throw sanitized || error;
    }
  };
}
