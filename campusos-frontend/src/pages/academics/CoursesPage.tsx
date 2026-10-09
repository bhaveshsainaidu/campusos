import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicsApi } from '../../api/academics';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { MagnifyingGlass, Plus, BookBookmark } from '@phosphor-icons/react';

export const CoursesPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const queryClient = useQueryClient();
  const { addToast } = useNotificationStore();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState<number>(1);
  const [credits, setCredits] = useState<number>(3);
  const [type, setType] = useState<'THEORY' | 'PRACTICAL' | 'HYBRID'>('THEORY');
  const [semester, setSemester] = useState<number>(1);

  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: academicsApi.getDepartments,
  });

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses', search, selectedDept],
    queryFn: () =>
      academicsApi.getCourses({
        search: search || undefined,
        departmentId: selectedDept ? Number(selectedDept) : undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: academicsApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      addToast({
        type: 'success',
        title: 'Course Created',
        message: `Course ${code} (${title}) has been registered.`,
      });
      handleCloseModal();
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Creation Failed',
        message: err.response?.data?.message || 'Could not register course.',
      });
    },
  });

  const handleCloseModal = () => {
    setCode('');
    setTitle('');
    setCredits(3);
    setType('THEORY');
    setSemester(1);
    setIsModalOpen(false);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      code,
      title,
      departmentId: Number(departmentId),
      credits: Number(credits),
      type,
      semester: Number(semester),
    });
  };

  const courses = coursesData?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Course Catalog
          </h1>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-0.5">
            Academic curriculum, credit specifications, and syllabus offerings
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus weight="bold" className="h-4 w-4" />}
          >
            Add Course
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course title or code (e.g. CS101)..."
            leftIcon={<MagnifyingGlass weight="duotone" className="h-4 w-4" />}
          />
        </div>
        <div>
          <Select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {deptData?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Course List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-apple-gray-400">Loading courses...</div>
      ) : courses.length === 0 ? (
        <Card className="p-12 text-center text-apple-gray-400 text-xs">
          No courses matching your search criteria.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course.id} hoverable className="p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-apple-blue/10 text-apple-blue dark:bg-apple-blue-dark/20 dark:text-apple-blue-dark">
                    {course.code}
                  </span>
                  <Badge
                    variant={course.type === 'PRACTICAL' ? 'info' : 'neutral'}
                    size="sm"
                  >
                    {course.type}
                  </Badge>
                </div>
                <h3 className="text-base font-semibold text-apple-gray-900 dark:text-white line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-xs text-apple-gray-500">
                  {course.departmentName || 'Academic Division'} • Semester {course.semester}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-apple-gray-200/50 dark:border-apple-gray-800/50 text-xs">
                <span className="text-apple-gray-500 font-medium flex items-center gap-1.5">
                  <BookBookmark weight="duotone" className="h-4 w-4" />
                  {course.credits} Credits
                </span>
                <span className="text-apple-gray-400">Graded</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Register New Academic Course"
        description="Define a new curriculum course, credit weight, and departmental assignment."
      >
        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Course Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. CS301"
              required
            />
            <Select
              label="Department"
              value={departmentId}
              onChange={(e) => setDepartmentId(Number(e.target.value))}
            >
              {deptData?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Distributed Computing"
            required
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Credits"
              type="number"
              min={1}
              max={12}
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              required
            />
            <Select
              label="Course Type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="THEORY">THEORY</option>
              <option value="PRACTICAL">PRACTICAL</option>
              <option value="HYBRID">HYBRID</option>
            </Select>
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

          <div className="flex justify-end gap-2 pt-3 border-t border-apple-gray-200/60 dark:border-apple-gray-800/60">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending}>
              Create Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
