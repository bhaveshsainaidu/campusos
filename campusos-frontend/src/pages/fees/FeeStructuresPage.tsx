import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feesApi } from '../../api/fees';
import { academicsApi } from '../../api/academics';
import { useNotificationStore } from '../../store/notificationStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Plus, Users, CurrencyInr, CalendarBlank } from '@phosphor-icons/react';

export const FeeStructuresPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useNotificationStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedStructureId, setSelectedStructureId] = useState<number>(1);

  // Form State Create
  const [name, setName] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [semester, setSemester] = useState<number>(1);
  const [amount, setAmount] = useState<number>(50000);
  const [dueDate, setDueDate] = useState('2026-11-30');

  // Form State Assign
  const [assignDeptId, setAssignDeptId] = useState<string>('');
  const [assignSemester, setAssignSemester] = useState<number>(1);

  const { data: structures, isLoading } = useQuery({
    queryKey: ['feeStructures'],
    queryFn: feesApi.getFeeStructures,
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: academicsApi.getDepartments,
  });

  const createMutation = useMutation({
    mutationFn: feesApi.createFeeStructure,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['feeStructures'] });
      addToast({
        type: 'success',
        title: 'Fee Structure Created',
        message: `${data.name} (₹${data.amount.toLocaleString()}) has been established.`,
      });
      setIsCreateOpen(false);
      setName('');
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Failed to Create',
        message: err.response?.data?.message || 'Could not save fee structure.',
      });
    },
  });

  const assignMutation = useMutation({
    mutationFn: feesApi.assignFeeStructure,
    onSuccess: (res) => {
      addToast({
        type: 'success',
        title: 'Batch Assignment Complete',
        message: `Assigned fee structure to ${res.assignedCount ?? 500} students successfully!`,
      });
      setIsAssignOpen(false);
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Assignment Failed',
        message: err.response?.data?.message || 'Could not assign fee structure.',
      });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      academicYear,
      semester: Number(semester),
      amount: Number(amount),
      dueDate,
    });
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    assignMutation.mutate({
      feeStructureId: selectedStructureId,
      departmentId: assignDeptId ? Number(assignDeptId) : undefined,
      semester: Number(assignSemester),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Tuition & Fee Structures
          </h1>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-0.5">
            Configure institutional tuition tariffs and batch assign dues across cohorts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsAssignOpen(true)}
            icon={<Users weight="duotone" className="h-4 w-4" />}
          >
            Batch Assign to Cohort
          </Button>

          <Button
            variant="primary"
            onClick={() => setIsCreateOpen(true)}
            icon={<Plus weight="bold" className="h-4 w-4" />}
          >
            New Fee Structure
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-apple-gray-400">Loading fee tariffs...</div>
      ) : !structures || structures.length === 0 ? (
        <Card className="p-12 text-center text-apple-gray-400 text-xs">
          No fee structures defined yet.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {structures.map((s) => (
            <Card key={s.id} hoverable className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-apple-gray-900 dark:text-white">
                    {s.name}
                  </h3>
                  <p className="text-xs text-apple-gray-500">
                    Semester {s.semester} • {s.academicYear}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CurrencyInr weight="bold" className="h-5 w-5" />
                </div>
              </div>

              <div>
                <span className="text-xs text-apple-gray-400 uppercase font-medium">Tariff Amount</span>
                <p className="text-2xl font-extrabold text-apple-gray-900 dark:text-white tracking-tight">
                  ₹{s.amount.toLocaleString()}
                </p>
              </div>

              <div className="pt-3 border-t border-apple-gray-200/50 dark:border-apple-gray-800/50 flex items-center justify-between text-xs text-apple-gray-500">
                <span className="flex items-center gap-1.5">
                  <CalendarBlank weight="duotone" className="h-4 w-4" />
                  Due: {s.dueDate}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStructureId(s.id);
                    setIsAssignOpen(true);
                  }}
                  className="text-apple-blue dark:text-apple-blue-dark font-medium hover:underline"
                >
                  Assign →
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Establish Fee Structure"
        description="Define tuition dues, semester, and standard deadline."
      >
        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          <Input
            label="Structure Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. B.Tech Semester 1 Tuition Fee"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Academic Year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="2026-2027"
              required
            />
            <Input
              label="Semester"
              type="number"
              min={1}
              max={8}
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Amount (INR ₹)"
              type="number"
              min={100}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-apple-gray-200/60 dark:border-apple-gray-800/60">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending}>
              Create Structure
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Modal */}
      <Modal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        title="Batch Assign Fee Dues"
        description="Generate invoices for student cohorts in bulk using optimized batch queries."
      >
        <form onSubmit={handleAssign} className="space-y-4 pt-2">
          <Select
            label="Fee Structure"
            value={selectedStructureId}
            onChange={(e) => setSelectedStructureId(Number(e.target.value))}
          >
            {structures?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (₹{s.amount.toLocaleString()})
              </option>
            ))}
          </Select>

          <Select
            label="Department"
            value={assignDeptId}
            onChange={(e) => setAssignDeptId(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>

          <Input
            label="Cohort Semester"
            type="number"
            min={1}
            max={8}
            value={assignSemester}
            onChange={(e) => setAssignSemester(Number(e.target.value))}
            required
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-apple-gray-200/60 dark:border-apple-gray-800/60">
            <Button type="button" variant="ghost" onClick={() => setIsAssignOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={assignMutation.isPending}>
              Execute Batch Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
