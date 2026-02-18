import { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import type { ServiceLogFormValues } from '../types/serviceLog';
import { SERVICE_LOG_TYPES } from '../types/serviceLog';
import { serviceLogSchema } from '../schemas/serviceLogSchema';
import { todayISO, tomorrowISO, addOneDay } from '../utils/dateDefaults';

export interface ServiceLogFormProps {
  defaultValues?: Partial<ServiceLogFormValues>;
  onSubmit: (values: ServiceLogFormValues) => void;
  onValuesChange?: (values: ServiceLogFormValues) => void;
  submitLabel?: string;
  disabled?: boolean;
  formId?: string;
}

const defaultFormValues: ServiceLogFormValues = {
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

export function ServiceLogForm({
  defaultValues: propDefaults,
  onSubmit,
  onValuesChange,
  submitLabel = 'Submit',
  disabled = false,
  formId,
}: ServiceLogFormProps) {
  const mergedDefaults = { ...defaultFormValues, ...propDefaults };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ServiceLogFormValues>({
    defaultValues: mergedDefaults,
    resolver: yupResolver(serviceLogSchema),
    mode: 'onChange',
  });

  const startDate = watch('startDate');
  const prevStartRef = useRef<string>(mergedDefaults.startDate);

  useEffect(() => {
    if (!startDate) return;
    if (startDate !== prevStartRef.current) {
      prevStartRef.current = startDate;
      setValue('endDate', addOneDay(startDate), { shouldValidate: true });
    }
  }, [startDate, setValue]);

  useEffect(() => {
    if (!propDefaults) return;
    reset(mergedDefaults);
    prevStartRef.current = mergedDefaults.startDate;
  }, [propDefaults?.startDate, propDefaults?.endDate]);

  useEffect(() => {
    if (!onValuesChange) return;
    const subscription = watch((values) => {
      onValuesChange(values as ServiceLogFormValues);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, onValuesChange]);

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="providerId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Provider ID"
                fullWidth
                required
                error={Boolean(errors.providerId)}
                helperText={errors.providerId?.message}
                disabled={disabled}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="serviceOrder"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Service order"
                fullWidth
                required
                error={Boolean(errors.serviceOrder)}
                helperText={errors.serviceOrder?.message}
                disabled={disabled}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="carId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Car ID"
                fullWidth
                required
                error={Boolean(errors.carId)}
                helperText={errors.carId?.message}
                disabled={disabled}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Controller
            name="odometer"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Odometer (mi)"
                fullWidth
                inputProps={{ min: 0 }}
                error={Boolean(errors.odometer)}
                helperText={errors.odometer?.message}
                disabled={disabled}
                onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Controller
            name="engineHours"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Engine hours"
                fullWidth
                inputProps={{ min: 0 }}
                error={Boolean(errors.engineHours)}
                helperText={errors.engineHours?.message}
                disabled={disabled}
                onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label="Start date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.startDate)}
                helperText={errors.startDate?.message}
                disabled={disabled}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label="End date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.endDate)}
                helperText={errors.endDate?.message}
                disabled={disabled}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required error={Boolean(errors.type)} disabled={disabled}>
                <InputLabel>Service type</InputLabel>
                <Select {...field} label="Service type">
                  {SERVICE_LOG_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && (
                  <Box component="span" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, display: 'block' }}>
                    {errors.type.message}
                  </Box>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="serviceDescription"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Service description"
                fullWidth
                required
                multiline
                rows={3}
                error={Boolean(errors.serviceDescription)}
                helperText={errors.serviceDescription?.message}
                disabled={disabled}
              />
            )}
          />
        </Grid>
        {submitLabel && (
          <Grid size={12}>
            <Button type="submit" variant="contained" disabled={disabled}>
              {submitLabel}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default ServiceLogForm;
