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
        deviceFingerprint: visitorId, 
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
