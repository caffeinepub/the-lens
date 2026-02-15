import { ShieldAlert } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <h1 className="mb-3 text-3xl font-bold">Access Denied</h1>
        <p className="mb-6 text-muted-foreground">
          You don't have permission to access this page. This area is restricted to administrators only.
        </p>
        <Button onClick={() => navigate({ to: '/' })}>
          Return to Home
        </Button>
      </div>
    </div>
  );
}
