// examples/shadcn-register-form.tsx
// A sleek registration form using Shadcn UI and FingerprintJS.

'use client';

import { useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { authClient } from '@/lib/auth-client'; // Your Better Auth client
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export function RegisterForm() {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      // 1. Get Device Fingerprint
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();

      // 2. Sign Up with Better Auth
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: '/dashboard',
        // Pass the fingerprint to the server plugin
        metadata: { fingerprintHash: visitorId }, 
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent a verification link to your inbox.",
      });

    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Enter your details to get started with Vibe Auth.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" onClick={() => window.location.href = '/api/auth/google'}>
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 265.2 0 128.7 110.3 18.2 244 18.2c71.2 0 131.3 28.3 176.2 71.3l-66.3 64.2c-26.3-24.6-60.3-39.6-99.9-39.6-83.2 0-151.3 68.1-151.3 151.3s68.1 151.3 151.3 151.3c96.1 0 130.3-70.1 134.9-106.3H244v-85.3h236.1c2.3 12.7 3.9 26.1 3.9 40.2z"></path></svg>
          Continue with Google
        </Button>
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>
      </CardContent>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
