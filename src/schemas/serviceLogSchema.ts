import * as yup from 'yup';
import { SERVICE_LOG_TYPES } from '../types/serviceLog';

export const serviceLogSchema = yup.object({
  providerId: yup.string().required('Provider ID is required'),
  serviceOrder: yup.string().required('Service order is required'),
  carId: yup.string().required('Car ID is required'),
  odometer: yup
    .number()
    .required('Odometer is required')
    .min(0, 'Odometer must be 0 or greater')
    .transform((v, o) => (o === '' || o === null || o === undefined ? undefined : Number(v))),
  engineHours: yup
    .number()
    .required('Engine hours is required')
    .min(0, 'Engine hours must be 0 or greater')
    .transform((v, o) => (o === '' || o === null || o === undefined ? undefined : Number(v))),
  startDate: yup
    .string()
    .required('Start date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD'),
  endDate: yup
    .string()
    .required('End date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD')
    .test('end-after-start', 'End date must be on or after start date', function (value) {
      const { startDate } = this.parent;
      if (!value || !startDate) return true;
      return new Date(value) >= new Date(startDate);
    }),
  type: yup
    .string()
    .oneOf(SERVICE_LOG_TYPES, 'Invalid service type')
    .required('Service type is required'),
  serviceDescription: yup.string().required('Service description is required'),
});

export type ServiceLogSchemaType = yup.InferType<typeof serviceLogSchema>;
