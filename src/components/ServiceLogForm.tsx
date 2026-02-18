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
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import type { ServiceLogFormValues } from '../types/serviceLog';
import { SERVICE_LOG_TYPES } from '../types/serviceLog';
import { serviceLogSchema } from '../schemas/serviceLogSchema';
import { todayISO, tomorrowISO, addOneDay } from '../utils/dateDefaults';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: 'background.paper',
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2 },
  },
} as const;

const sectionTitleSx = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  color: 'text.secondary',
  mb: 1.5,
  mt: 0,
  lineHeight: 1.4,
} as const;

export interface ServiceLogFormProps {
  defaultValues?: Partial<ServiceLogFormValues>;
  onSubmit: (values: ServiceLogFormValues) => void;
  onValuesChange?: (values: ServiceLogFormValues) => void;
  submitLabel?: string;
  disabled?: boolean;
  formId?: string;
  /** Section title shown above the form (e.g. "New service log"). Omit in dialogs. */
  formTitle?: string | null;
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
  formTitle = 'New service log',
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
    <Paper
      component="form"
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      {formTitle != null && formTitle !== '' && (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}>
          {formTitle}
        </Typography>
      )}

      <Typography component="span" sx={sectionTitleSx}>
        Identifiers
      </Typography>
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
                sx={fieldSx}
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
                sx={fieldSx}
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
                sx={fieldSx}
              />
            )}
          />
        </Grid>
      </Grid>

      <Typography component="span" sx={{ ...sectionTitleSx, mt: 3 }}>
        Vehicle & metrics
      </Typography>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
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
                sx={fieldSx}
                onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
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
                sx={fieldSx}
                onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
              />
            )}
          />
        </Grid>
      </Grid>

      <Typography component="span" sx={{ ...sectionTitleSx, mt: 3 }}>
        Schedule
      </Typography>
      <Grid container spacing={2} sx={{ mt: 0 }}>
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
                sx={fieldSx}
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
                sx={fieldSx}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                required
                error={Boolean(errors.type)}
                disabled={disabled}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                  },
                }}
              >
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
      </Grid>

      <Typography component="span" sx={{ ...sectionTitleSx, mt: 3 }}>
        Service details
      </Typography>
      <Grid container spacing={2} sx={{ mt: 0 }}>
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
                rows={4}
                error={Boolean(errors.serviceDescription)}
                helperText={errors.serviceDescription?.message}
                disabled={disabled}
                sx={fieldSx}
              />
            )}
          />
        </Grid>
      </Grid>

      {submitLabel && (
        <>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" size="large" disabled={disabled} sx={{ px: 3 }}>
              {submitLabel}
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
}

export default ServiceLogForm;
