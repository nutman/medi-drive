import type { ServiceLogSchemaType } from '../schemas/serviceLogSchema';
import type { ServiceLogType } from '../constants/serviceLogConstants';
import { SERVICE_LOG_TYPES } from '../constants/serviceLogConstants';

export type { ServiceLogType };
export { SERVICE_LOG_TYPES };

/** Form values type; aligned with Yup schema (ServiceLogSchemaType). */
export type ServiceLogFormValues = ServiceLogSchemaType;

export interface ServiceLogDraft extends ServiceLogFormValues {
  id: string;
  updatedAt: number;
}

export interface ServiceLog extends ServiceLogFormValues {
  id: string;
  createdAt: number;
}
