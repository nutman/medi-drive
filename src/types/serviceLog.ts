export type ServiceLogType = 'planned' | 'unplanned' | 'emergency';

export const SERVICE_LOG_TYPES: ServiceLogType[] = ['planned', 'unplanned', 'emergency'];

export interface ServiceLogFormValues {
  providerId: string;
  serviceOrder: string;
  carId: string;
  odometer: number;
  engineHours: number;
  startDate: string;
  endDate: string;
  type: ServiceLogType;
  serviceDescription: string;
}

export interface ServiceLogDraft extends ServiceLogFormValues {
  id: string;
  updatedAt: number;
}

export interface ServiceLog extends ServiceLogFormValues {
  id: string;
  createdAt: number;
}
