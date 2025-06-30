import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import apiService from '../services/api';
import toast from 'react-hot-toast';

interface Organization {
  id: string;
  name: string;
  code: string;
  industry: string;
  plan: string;
  employeeCount: number;
  adminName: string;
  adminEmail: string;
  createdAt: string;
  isActive: boolean;
}

const SuperAdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    code: '',
    industry: '',
    plan: 'free',
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const data = await apiService.getOrganizations();
      setOrganizations(data);
    } catch (error) {
      toast.error('Failed to fetch organizations');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Create organization
      const orgRes = await apiService.createOrganization({
        name: form.name,
        code: form.code,
        industry: form.industry,
        plan: form.plan,
        adminName: form.adminName,
        adminEmail: form.adminEmail
      });
      // 2. Register company admin
      await apiService.register({
        name: form.adminName,
        email: form.adminEmail,
        password: form.adminPassword,
        role: 'company_admin',
        organizationId: orgRes.id
      });
      toast.success('Organization and admin created!');
      setShowCreateModal(false);
      setForm({ name: '', code: '', industry: '', plan: 'free', adminName: '', adminEmail: '', adminPassword: '' });
      fetchOrganizations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create organization');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <Button onClick={() => setShowCreateModal(true)}>Add Company + Admin</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map(org => (
          <Card key={org.id}>
            <CardHeader>
              <CardTitle>{org.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">Industry: {org.industry}</div>
              <div className="text-sm text-gray-600">Plan: {org.plan}</div>
              <div className="text-sm text-gray-600">Admin: {org.adminName} ({org.adminEmail})</div>
              <div className="text-xs text-gray-400 mt-2">Created: {new Date(org.createdAt).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add Company & Admin</h2>
            <form onSubmit={handleCreateOrganization} className="space-y-4">
              <Input name="name" placeholder="Company Name" value={form.name} onChange={handleInputChange} required />
              <Input name="code" placeholder="Company Code" value={form.code} onChange={handleInputChange} required />
              <Input name="industry" placeholder="Industry" value={form.industry} onChange={handleInputChange} required />
              <select name="plan" value={form.plan} onChange={handleInputChange} className="w-full p-2 border rounded">
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <Input name="adminName" placeholder="Admin Name" value={form.adminName} onChange={handleInputChange} required />
              <Input name="adminEmail" type="email" placeholder="Admin Email" value={form.adminEmail} onChange={handleInputChange} required />
              <Input name="adminPassword" type="password" placeholder="Admin Password" value={form.adminPassword} onChange={handleInputChange} required minLength={6} />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
