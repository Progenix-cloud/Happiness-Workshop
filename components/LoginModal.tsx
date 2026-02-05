'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/context/AuthContext';
import { 
  Users, 
  GraduationCap, 
  UserCircle, 
  Handshake, 
  Heart, 
  Building2, 
  Shield, 
  BookOpen, 
  Crown, 
  ShieldCheck 
} from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const userRoles = [
  { id: 'volunteer', label: 'Volunteer', icon: Users, color: 'from-yellow-400 to-yellow-600', description: 'Help spread happiness' },
  { id: 'trainer', label: 'Trainer', icon: GraduationCap, color: 'from-teal-400 to-teal-600', description: 'Lead workshops' },
  { id: 'participant', label: 'Participant', icon: UserCircle, color: 'from-orange-400 to-orange-600', description: 'Attend workshops' },
  { id: 'partner', label: 'Partner', icon: Handshake, color: 'from-blue-400 to-blue-600', description: 'Collaborate with us' },
  { id: 'donor', label: 'Donor', icon: Heart, color: 'from-pink-400 to-pink-600', description: 'Support our mission' },
  { id: 'rwa', label: 'RWA', icon: Building2, color: 'from-purple-400 to-purple-600', description: 'Community association' },
  { id: 'admin', label: 'Admin', icon: Shield, color: 'from-red-400 to-red-600', description: 'System administration' },
  { id: 'phd-scholar', label: 'Ph.D Scholar', icon: BookOpen, color: 'from-indigo-400 to-indigo-600', description: 'Research & study' },
  { id: 'director', label: 'Director', icon: Crown, color: 'from-amber-400 to-amber-600', description: 'Leadership team' },
  { id: 'co-admin', label: 'Co-Admin', icon: ShieldCheck, color: 'from-cyan-400 to-cyan-600', description: 'Administrative support' },
];

export function LoginModal({ open, onOpenChange, onSuccess }: LoginModalProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'role-selection' | 'credentials'>('role-selection');

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setStep('credentials');

    // Pre-fill email based on role for demo purposes
    const demoEmails: Record<string, string> = {
      'volunteer': 'volunteer@happiness.com',
      'trainer': 'trainer@happiness.com',
      'participant': 'participant@happiness.com',
      'partner': 'partner@happiness.com',
      'donor': 'donor@happiness.com',
      'rwa': 'rwa@happiness.com',
      'admin': 'admin@happiness.com',
      'phd-scholar': 'phd@happiness.com',
      'director': 'director@happiness.com',
      'co-admin': 'coadmin@happiness.com',
    };
    
    setEmail(demoEmails[roleId] || '');
    setPassword('password123'); // Auto-fill password too!
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep('role-selection');
    setSelectedRole(null);
    setError('');
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep('role-selection');
      setSelectedRole(null);
      setEmail('');
      setPassword('');
      setError('');
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-500 via-teal-500 to-orange-500 bg-clip-text text-transparent">
            {step === 'role-selection' ? 'Welcome to Happiness' : 'Enter Your Credentials'}
          </DialogTitle>
          <DialogDescription>
            {step === 'role-selection' 
              ? 'Select your role to continue' 
              : `Logging in as ${userRoles.find(r => r.id === selectedRole)?.label}`}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'role-selection' ? (
            <RoleSelectionStep
              key="role-selection"
              roles={userRoles}
              onSelectRole={handleRoleSelect}
            />
          ) : (
            <CredentialsStep
              key="credentials"
              email={email}
              password={password}
              error={error}
              isSubmitting={isSubmitting}
              selectedRole={selectedRole}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={handleLogin}
              onBack={handleBack}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function RoleSelectionStep({ 
  roles, 
  onSelectRole 
}: { 
  roles: typeof userRoles; 
  onSelectRole: (roleId: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4"
    >
      {roles.map((role, index) => {
        const Icon = role.icon;
        return (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={() => onSelectRole(role.id)}
            className="group relative p-4 rounded-xl border-2 border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 bg-white overflow-hidden"
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Content */}
            <div className="relative flex flex-col items-center text-center space-y-2">
              <div className={`p-3 rounded-full bg-gradient-to-br ${role.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                  {role.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {role.description}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

function CredentialsStep({
  email,
  password,
  error,
  isSubmitting,
  selectedRole,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onBack,
}: {
  email: string;
  password: string;
  error: string;
  isSubmitting: boolean;
  selectedRole: string | null;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}) {
  const role = userRoles.find(r => r.id === selectedRole);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 py-4"
    >
      {/* Selected Role Display */}
      {role && (
        <div className={`p-4 rounded-lg bg-gradient-to-br ${role.color} bg-opacity-10 border-2 border-current flex items-center gap-3`}>
          <div className={`p-2 rounded-full bg-gradient-to-br ${role.color} text-white`}>
            <role.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{role.label}</p>
            <p className="text-sm text-gray-600">{role.description}</p>
          </div>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={isSubmitting}
            required
            className="h-12 bg-blue-50 border-blue-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            disabled={isSubmitting}
            required
            className="h-12 bg-blue-50 border-blue-200"
          />
        </div>

        {/* Demo Credentials Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="text-blue-800">
            <strong>Demo Account:</strong><br/>
            Email: <span className="font-mono font-semibold text-blue-900">{email || 'auto-filled'}</span><br/>
            Password: <span className="font-mono font-semibold text-blue-900">password123</span>
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
