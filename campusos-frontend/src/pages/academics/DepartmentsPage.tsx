import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { academicsApi } from '../../api/academics';
import { Card } from '../../components/common/Card';
import { Buildings, ChalkboardTeacher } from '@phosphor-icons/react';

export const DepartmentsPage: React.FC = () => {
  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: academicsApi.getDepartments,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
          Academic Departments
        </h1>
        <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-0.5">
          Divisions of university research and undergraduate faculties
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-apple-gray-400">Loading departments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments?.map((dept) => (
            <Card key={dept.id} hoverable className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-apple-gray-100 dark:bg-apple-gray-800 flex items-center justify-center text-apple-blue dark:text-apple-blue-dark">
                  <Buildings weight="duotone" className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-gray-700 dark:text-apple-gray-300">
                  {dept.code}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-semibold text-apple-gray-900 dark:text-white">
                  {dept.name}
                </h3>
                <p className="text-xs text-apple-gray-500 line-clamp-2">
                  {dept.description || 'Core academic department delivering accredited degrees and laboratory curricula.'}
                </p>
              </div>

              <div className="pt-3 border-t border-apple-gray-200/50 dark:border-apple-gray-800/50 flex items-center gap-2 text-xs text-apple-gray-500">
                <ChalkboardTeacher weight="duotone" className="h-4 w-4" />
                <span>Head: {dept.headOfDepartment || 'Department Chair'}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
