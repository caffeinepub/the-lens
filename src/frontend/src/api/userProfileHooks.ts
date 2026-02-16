import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { UserProfile } from '../backend';
import { queryKeys } from './queryKeys';
import { sanitizeAuthFlowError } from '../utils/authFlowErrorSanitizer';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: queryKeys.userProfile.current,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      // Front-end guard: check authentication before calling backend
      if (!identity || identity.getPrincipal().isAnonymous()) {
        throw new Error('Please sign in with Internet Identity to continue.');
      }

      if (!actor) throw new Error('Actor not available');

      try {
        return await actor.saveCallerUserProfile(profile);
      } catch (error: unknown) {
        // Sanitize backend errors
        throw new Error(sanitizeAuthFlowError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile.current });
    },
  });
}
