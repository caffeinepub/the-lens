import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface AsyncStateProps {
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children?: React.ReactNode;
  skeletonCount?: number;
}

export default function AsyncState({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage = 'No items found.',
  onRetry,
  children,
  skeletonCount = 3,
}: AsyncStateProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="mt-2">
          {error?.message || 'Something went wrong. Please try again.'}
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm" className="mt-3">
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}

export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-accent mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
