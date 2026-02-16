/**
 * Sanitizes authorization and authentication errors from the login/profile save
 * and phone verification flows into friendly, plain-English guidance.
 */
export function sanitizeAuthFlowError(error: unknown): string {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();

  // Detect authorization/authentication errors
  if (
    lowerMessage.includes('unauthorized') ||
    lowerMessage.includes('anonymous') ||
    lowerMessage.includes('not authenticated') ||
    lowerMessage.includes('authentication required')
  ) {
    return 'Please sign in with Internet Identity to continue.';
  }

  // Detect IC replica rejection patterns and extract plain-English text
  if (lowerMessage.includes('reject code') || lowerMessage.includes('reject text')) {
    // Try to extract the reject text between quotes
    const rejectTextMatch = errorMessage.match(/reject text:\s*"?([^"]+)"?/i);
    if (rejectTextMatch && rejectTextMatch[1]) {
      const rejectText = rejectTextMatch[1].trim();
      // If it's an authorization error, use our friendly message
      if (
        rejectText.toLowerCase().includes('unauthorized') ||
        rejectText.toLowerCase().includes('anonymous')
      ) {
        return 'Please sign in with Internet Identity to continue.';
      }
      // Otherwise return the cleaned reject text
      return rejectText;
    }
  }

  // Profile-specific errors
  if (lowerMessage.includes('profile not found')) {
    return 'Please save your profile first before verifying your phone.';
  }

  // Phone verification errors
  if (lowerMessage.includes('invalid or expired')) {
    return 'Invalid or expired verification code. Please try again.';
  }

  if (lowerMessage.includes('can only verify the phone number in your profile')) {
    return 'The phone number must match your profile. Please update your profile first.';
  }

  // Actor availability
  if (lowerMessage.includes('actor not available')) {
    return 'Service is temporarily unavailable. Please try again in a moment.';
  }

  // Default: return a cleaned version of the error without technical details
  // Remove request IDs, reject codes, CBOR references, and principal IDs
  let cleaned = errorMessage
    .replace(/Request ID:?\s*[a-f0-9-]+/gi, '')
    .replace(/Reject code:?\s*\d+/gi, '')
    .replace(/CBOR[^,.]*/gi, '')
    .replace(/Principal\s+"[^"]+"/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If we've cleaned everything away, provide a generic message
  if (!cleaned || cleaned.length < 10) {
    return 'An error occurred. Please try again.';
  }

  return cleaned;
}
