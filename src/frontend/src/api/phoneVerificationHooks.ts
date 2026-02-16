import { useMutation, useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { queryKeys } from './queryKeys';
import { sanitizeAuthFlowError } from '../utils/authFlowErrorSanitizer';

export function useRequestPhoneVerification() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (phone: string) => {
      // Front-end guard: check authentication before calling backend
      if (!identity || identity.getPrincipal().isAnonymous()) {
        throw new Error('Please sign in with Internet Identity to continue.');
      }

      if (!actor) throw new Error('Actor not available');

      try {
        await actor.requestPhoneVerification(phone);
        return { success: true };
      } catch (error: unknown) {
        // Sanitize backend errors
        throw new Error(sanitizeAuthFlowError(error));
      }
    },
  });
}

export function useVerifyPhoneVerificationCode() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ phone, code }: { phone: string; code: string }) => {
      // Front-end guard: check authentication before calling backend
      if (!identity || identity.getPrincipal().isAnonymous()) {
        throw new Error('Please sign in with Internet Identity to continue.');
      }

      if (!actor) throw new Error('Actor not available');

      try {
        const result = await actor.verifyPhoneVerificationCode(phone, code);
        if (!result) {
          throw new Error('Invalid or expired verification code');
        }
        return result;
      } catch (error: unknown) {
        // Sanitize backend errors
        throw new Error(sanitizeAuthFlowError(error));
      }
    },
  });
}

export function useIsPhoneVerified(phone: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: queryKeys.phoneVerification.status(phone),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isPhoneVerified(phone);
    },
    enabled: !!actor && !actorFetching && !!phone,
    retry: false,
  });
}
