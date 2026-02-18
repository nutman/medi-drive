import type { ServiceLogFormValues } from '../types/serviceLog';
import { todayISO, tomorrowISO } from '../utils/dateDefaults';

/**
 * Returns fresh default form values (dates are computed at call time).
 * Single source of truth for initial/reset form state.
 */
export function getDefaultFormValues(): ServiceLogFormValues {
  return {
    providerId: '',
    serviceOrder: '',
    carId: '',
    odometer: 0,
    engineHours: 0,
    startDate: todayISO(),
    endDate: tomorrowISO(),
    type: 'planned',
    serviceDescription: '',
  };
}
