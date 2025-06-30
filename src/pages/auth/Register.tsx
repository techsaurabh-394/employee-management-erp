import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { registerUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../components/common/ProtectedRoute';

const roles = [
  { value: 'company_admin', label: 'Company Admin' },
  { value: 'hr', label: 'HR' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' }
];

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee' as 'super_admin' | 'company_admin' | 'hr' | 'manager' | 'employee',
    organizationId: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await dispatch(registerUser(formData) as any);
      if (result.type === 'auth/register/fulfilled') {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.payload || 'Registration failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProtectedRoute requiredRoles={['super_admin']}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Create your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />
                <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required minLength={6} />
                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2 border rounded">
                  {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                {formData.role !== 'super_admin' && (
                  <Input name="organizationId" placeholder="Organization ID" value={formData.organizationId} onChange={handleInputChange} required />
                )}
                {/* Organization selector for super admin */}
                {user && user.role === 'super_admin' && (
                  <Input name="organizationId" placeholder="Organization ID" value={formData.organizationId} onChange={handleInputChange} required />
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</Button>
              </form>
              <div className="text-center mt-4">
                <span>Already have an account? </span>
                <a href="/login" className="text-blue-600 hover:underline">Login</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Register;
