import { useQuery } from '@tanstack/react-query';

export type ApplicationInfo = {
  host: string;
  port: number;
  email?: string;
  phone?: string;
  address?: string;
  workingHours?: string;
  website?: string;
};

export function useApplicationInfo() {
  const { data: applicationInfo, isLoading } = useQuery({
    queryKey: ['applicationInfo'],
    queryFn: () => fetch('/api/application').then((x) => x.json() as Promise<API.Data<ApplicationInfo>>),
    select: (x) => x.data,
  });
  return { applicationInfo, isLoading };
}
