/**
 * Centralized error sanitization for public storefront browsing queries.
 * Detects stopped-canister replica rejections, actor-unavailable states, and other technical errors,
 * mapping them to user-friendly English messages.
 */

interface SanitizedError extends Error {
  originalMessage?: string;
}

/**
 * Detects if an error is an "Actor not available" condition.
 */
function isActorUnavailableError(error: Error): boolean {
  const message = error.message || '';
  return message.includes('Actor not available');
}

/**
 * Detects if an error is a stopped-canister replica rejection (IC0508).
 * Only returns true for genuine canister-stopped errors, not normal backend traps.
 */
function isStoppedCanisterError(error: Error): boolean {
  const message = error.message || '';
  
  // Check for IC0508 error code (specific stopped canister error)
  if (message.includes('IC0508')) return true;
  
  // Check for explicit stopped canister text
  if (message.includes('is stopped')) return true;
  if (message.includes('CallContextManager')) return true;
  
  // Do NOT treat generic "Reject code: 5" as stopped canister
  // Reject code 5 is a generic canister error that includes normal traps
  
  return false;
}

/**
 * Detects if an error is a "not found" error.
 */
function isNotFoundError(error: Error): boolean {
  const message = error.message || '';
  const lowerMessage = message.toLowerCase();
  
  return (
    lowerMessage.includes('not found') ||
    lowerMessage.includes('does not exist') ||
    lowerMessage.includes('no such')
  );
}

/**
 * Detects if an error is an authorization/permission error.
 */
function isAuthorizationError(error: Error): boolean {
  const message = error.message || '';
  const lowerMessage = message.toLowerCase();
  
  return (
    lowerMessage.includes('unauthorized') ||
    lowerMessage.includes('permission') ||
    lowerMessage.includes('access denied') ||
    lowerMessage.includes('forbidden')
  );
}

/**
 * Detects if an error message contains technical replica rejection details.
 */
function isReplicaRejectionError(error: Error): boolean {
  const message = error.message || '';
  
  // Check for replica rejection patterns (but not simple backend traps)
  if (message.includes('replica returned a rejection')) return true;
  if (message.includes('Request ID:')) return true;
  if (message.includes('__principal__')) return true;
  if (message.includes('CBOR') || message.includes('cbor')) return true;
  if (message.includes('HTTP details:')) return true;
  
  return false;
}

/**
 * Detects if an error is a simple backend trap (business logic error).
 */
function isBackendTrapError(error: Error): boolean {
  const message = error.message || '';
  
  // Backend traps typically have "Reject code: 5" but also contain "Reject text:"
  // with a plain English message from the backend
  if (message.includes('Reject code: 5') && message.includes('Reject text:')) {
    return true;
  }
  
  return false;
}

/**
 * Extracts the reject text from a backend trap error.
 */
function extractRejectText(error: Error): string | null {
  const message = error.message || '';
  const match = message.match(/Reject text:\s*(.+?)(?:\n|$)/);
  return match ? match[1].trim() : null;
}

/**
 * Sanitizes backend errors for public storefront browsing.
 * Maps stopped-canister, actor-unavailable, and replica rejection errors to friendly English messages.
 */
export function sanitizeStorefrontError(error: Error | null | undefined): Error | null {
  if (!error) return null;
  
  // Check for actor unavailable first (most common during startup)
  if (isActorUnavailableError(error)) {
    const sanitized: SanitizedError = new Error(
      'The store is loading. Please wait a moment and try again.'
    );
    sanitized.name = 'ServiceInitializingError';
    sanitized.originalMessage = error.message;
    return sanitized;
  }
  
  // Check for backend trap errors (business logic errors from Motoko)
  if (isBackendTrapError(error)) {
    const rejectText = extractRejectText(error);
    
    if (rejectText) {
      // Check if it's a specific error type
      if (isNotFoundError({ message: rejectText } as Error)) {
        const sanitized: SanitizedError = new Error(rejectText);
        sanitized.name = 'NotFoundError';
        sanitized.originalMessage = error.message;
        return sanitized;
      }
      
      if (isAuthorizationError({ message: rejectText } as Error)) {
        const sanitized: SanitizedError = new Error(
          'You do not have permission to access this resource.'
        );
        sanitized.name = 'AuthorizationError';
        sanitized.originalMessage = error.message;
        return sanitized;
      }
      
      // Return the clean reject text for other business logic errors
      const sanitized: SanitizedError = new Error(rejectText);
      sanitized.name = 'BackendError';
      sanitized.originalMessage = error.message;
      return sanitized;
    }
  }
  
  // Check for stopped canister (specific IC error)
  if (isStoppedCanisterError(error)) {
    const sanitized: SanitizedError = new Error(
      'The store service is temporarily unavailable. Please try again in a moment.'
    );
    sanitized.name = 'ServiceUnavailableError';
    sanitized.originalMessage = error.message;
    return sanitized;
  }
  
  // Check for other replica rejection errors with technical details
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
      message.includes('canister id') || 
      message.includes('principal id') ||
      message.includes('ingress_expiry')) {
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
