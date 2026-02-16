import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';
import { CheckCircle2, Loader2, AlertCircle, LogIn } from 'lucide-react';
import { useRequestPhoneVerification, useVerifyPhoneVerificationCode } from '../api/phoneVerificationHooks';
import { useSaveCallerUserProfile } from '../api/userProfileHooks';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { UserProfile } from '../backend';

const PHONE_DRAFT_KEY = 'login_phone_draft';
const DEFAULT_PHONE_PREFIX = '+91 ';
const RESEND_COOLDOWN_SECONDS = 30;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, identity, loginStatus } = useInternetIdentity();
  
  // Initialize phone with session draft or default India prefix
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  const requestOtp = useRequestPhoneVerification();
  const verifyOtp = useVerifyPhoneVerificationCode();
  const saveProfile = useSaveCallerUserProfile();

  // Check if user is authenticated
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const isAuthenticating = loginStatus === 'logging-in' || loginStatus === 'initializing';

  // Initialize phone field with session draft or default prefix
  useEffect(() => {
    const draft = sessionStorage.getItem(PHONE_DRAFT_KEY);
    setFormData(prev => ({
      ...prev,
      phone: draft || DEFAULT_PHONE_PREFIX,
    }));
  }, []);

  // Clear auth-related errors when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      setErrors(prev => {
        const { submit, ...rest } = prev;
        // Only clear if it was an auth error
        if (submit?.toLowerCase().includes('sign in')) {
          return rest;
        }
        return prev;
      });
    }
  }, [isAuthenticated]);

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Clear resend success message after 3 seconds
  useEffect(() => {
    if (resendSuccess) {
      const timer = setTimeout(() => {
        setResendSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [resendSuccess]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({ submit: 'Failed to sign in. Please try again.' });
    }
  };

  const handleSendCode = async () => {
    if (!isAuthenticated) {
      setErrors({ submit: 'Please sign in with Internet Identity first.' });
      return;
    }

    if (!validateForm()) return;

    try {
      // First save the profile without phone verification
      const profileToSave: UserProfile = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        phoneVerified: false,
      };
      await saveProfile.mutateAsync(profileToSave);

      // Then request OTP
      await requestOtp.mutateAsync(formData.phone);
      setStep('otp');
      setErrors({});
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to send verification code' });
    }
  };

  const handleResendCode = async () => {
    if (!isAuthenticated) {
      setErrors({ resend: 'Please sign in with Internet Identity first.' });
      return;
    }

    try {
      // Only request OTP, don't re-save profile
      await requestOtp.mutateAsync(formData.phone);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setResendSuccess(true);
      setErrors(prev => {
        const { resend, ...rest } = prev;
        return rest;
      });
    } catch (error: any) {
      setErrors({ resend: error.message || 'Failed to resend verification code' });
      setResendSuccess(false);
    }
  };

  const handleVerifyCode = async () => {
    if (otpCode.length !== 4) {
      setErrors({ otp: 'Please enter the 4-digit code' });
      return;
    }

    try {
      await verifyOtp.mutateAsync({ phone: formData.phone, code: otpCode });
      
      // Update profile with verified status
      const verifiedProfile: UserProfile = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        phoneVerified: true,
      };
      await saveProfile.mutateAsync(verifiedProfile);
      
      setStep('success');
      setErrors({});
      // Clear session draft on success
      sessionStorage.removeItem(PHONE_DRAFT_KEY);
    } catch (error: any) {
      setErrors({ otp: error.message || 'Verification failed' });
    }
  };

  const handleContinue = () => {
    navigate({ to: '/' });
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value });
    setErrors({ ...errors, phone: '' });
    // Persist user edits to session storage
    sessionStorage.setItem(PHONE_DRAFT_KEY, value);
  };

  const canResend = resendCooldown === 0 && !requestOtp.isPending;

  return (
    <div className="container-custom py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 'form' && 'Create Your Profile'}
              {step === 'otp' && 'Verify Your Phone'}
              {step === 'success' && 'Profile Created!'}
            </CardTitle>
            <CardDescription>
              {step === 'form' && 'Sign in and enter your details to get started'}
              {step === 'otp' && `We sent a verification code to ${formData.phone}`}
              {step === 'success' && 'Your profile has been successfully created'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'form' && (
              <div className="space-y-4">
                {!isAuthenticated && (
                  <div className="space-y-3">
                    <Alert>
                      <LogIn className="h-4 w-4" />
                      <AlertDescription>
                        Please sign in with Internet Identity to create your profile.
                      </AlertDescription>
                    </Alert>
                    <Button
                      onClick={handleSignIn}
                      disabled={isAuthenticating}
                      className="w-full"
                      variant="default"
                    >
                      {isAuthenticating && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Sign in with Internet Identity
                    </Button>
                  </div>
                )}

                {isAuthenticated && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          setErrors({ ...errors, name: '' });
                        }}
                        className={errors.name ? 'border-destructive' : ''}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setErrors({ ...errors, email: '' });
                        }}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className={errors.phone ? 'border-destructive' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>

                    {errors.submit && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.submit}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleSendCode}
                      disabled={requestOtp.isPending || saveProfile.isPending}
                      className="w-full"
                    >
                      {(requestOtp.isPending || saveProfile.isPending) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Send Verification Code
                    </Button>
                  </>
                )}
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={4}
                      value={otpCode}
                      onChange={(value) => {
                        setOtpCode(value);
                        setErrors({ ...errors, otp: '' });
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Enter the 4-digit code sent to your phone
                  </p>
                  {errors.otp && (
                    <p className="text-sm text-destructive text-center">{errors.otp}</p>
                  )}
                </div>

                {resendSuccess && (
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      A new code has been sent to your phone.
                    </AlertDescription>
                  </Alert>
                )}

                {errors.resend && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.resend}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Button
                    onClick={handleVerifyCode}
                    disabled={verifyOtp.isPending || saveProfile.isPending || otpCode.length !== 4}
                    className="w-full"
                  >
                    {(verifyOtp.isPending || saveProfile.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Verify Code
                  </Button>

                  <div className="space-y-1">
                    <Button
                      variant="outline"
                      onClick={handleResendCode}
                      disabled={!canResend}
                      className="w-full"
                    >
                      {requestOtp.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Resend Code
                    </Button>
                    {resendCooldown > 0 && (
                      <p className="text-xs text-muted-foreground text-center">
                        You can resend a code in {resendCooldown}s
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center py-6">
                  <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
                  <p className="text-center text-muted-foreground">
                    Your phone number has been verified and your profile is ready to use.
                  </p>
                </div>

                <Button onClick={handleContinue} className="w-full">
                  Continue to Shop
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
