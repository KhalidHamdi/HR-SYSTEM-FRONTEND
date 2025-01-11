import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, Check, X, Download, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../lib/axios';
import { Employee, Attendance as AttendanceType } from '../types';

type Period = 'day' | 'week' | 'month' | 'year';

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('day');
  const queryClient = useQueryClient();

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await api.get('/employees/');
      return data;
    },
  });

  const { data: attendances, isLoading } = useQuery<AttendanceType[]>({
    queryKey: ['attendances', selectedDate, selectedPeriod],
    queryFn: async () => {
      const { data } = await api.get(`/attendance/?date=${selectedDate}&period=${selectedPeriod}`);
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { employee: number; date: string; is_present: boolean }) =>
      api.post('/attendance/', data),
    onSuccess: () => {
      toast.success('Attendance marked successfully!');
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
    },
    onError: () => {
      toast.error('Failed to mark attendance.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { is_present: boolean };
    }) => api.put(`/attendance/${id}/`, data),
    onSuccess: () => {
      toast.success('Attendance updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
    },
    onError: () => {
      toast.error('Failed to update attendance.');
    },
  });

  const handleAttendanceChange = (
    employee: Employee,
    attendance: AttendanceType | undefined,
    isPresent: boolean
  ) => {
    if (attendance) {
      updateMutation.mutate({
        id: attendance.id,
        data: { is_present: isPresent },
      });
    } else {
      createMutation.mutate({
        employee: employee.id,
        date: selectedDate,
        is_present: isPresent,
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/attendance/', {
        params: {
          date: selectedDate,
          period: selectedPeriod,
          export: 'csv'  
        },
        responseType: 'blob',
      });
  
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${selectedPeriod}_${selectedDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Attendance exported successfully!');
    } catch (error) {
      toast.error('Failed to export attendance.');
      console.error('Export failed:', error);
    }
  };
  
  

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Loading attendance...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as Period)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees?.map((employee) => {
              const attendance = attendances?.find(
                (a) => a.employee === employee.id
              );
              return (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {employee.first_name} {employee.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{employee.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        attendance?.is_present
                          ? 'bg-green-100 text-green-800'
                          : attendance
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {attendance?.is_present
                        ? 'Present'
                        : attendance
                        ? 'Absent'
                        : 'Not Marked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        handleAttendanceChange(employee, attendance, true)
                      }
                      className={`text-green-600 hover:text-green-900 mr-4 ${
                        attendance?.is_present ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={attendance?.is_present}
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        handleAttendanceChange(employee, attendance, false)
                      }
                      className={`text-red-600 hover:text-red-900 ${
                        attendance?.is_present === false
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      disabled={attendance?.is_present === false}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
