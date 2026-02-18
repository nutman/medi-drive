import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addOrUpdateDraft,
  removeDraft,
  clearAllDrafts,
  setCurrentDraftId,
  setSaving,
} from '../store/slices/draftsSlice';
import { addServiceLog, updateServiceLog, removeServiceLog } from '../store/slices/serviceLogsSlice';
import { ServiceLogForm } from '../components/ServiceLogForm';
import { DraftList } from '../components/DraftList';
import { ServiceLogsTable } from '../components/ServiceLogsTable';
import { EditServiceLogDialog } from '../components/EditServiceLogDialog';
import type { ServiceLogFormValues } from '../types/serviceLog';
import type { ServiceLog } from '../types/serviceLog';
import type { ServiceLogDraft } from '../types/serviceLog';
import { todayISO, tomorrowISO } from '../utils/dateDefaults';

function useDebounce<T>(value: T, delay: number, onDebounced: (v: T) => void) {
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    ref.current = setTimeout(() => onDebounced(value), delay);
    return () => {
      if (ref.current) clearTimeout(ref.current);
    };
  }, [value, delay, onDebounced]);
}

export default function ServiceLogsPage() {
  const dispatch = useAppDispatch();
  const { items: drafts, currentDraftId, saving, lastSavedAt } = useAppSelector((s) => s.drafts);
  const serviceLogs = useAppSelector((s) => s.serviceLogs);

  const [formValues, setFormValues] = useState<ServiceLogFormValues>({
    providerId: '',
    serviceOrder: '',
    carId: '',
    odometer: 0,
    engineHours: 0,
    startDate: todayISO(),
    endDate: tomorrowISO(),
    type: 'planned',
    serviceDescription: '',
  });
  const [editLog, setEditLog] = useState<ServiceLog | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' | 'info' } | null>(null);

  const handleFormValuesChange = useCallback((values: ServiceLogFormValues) => {
    setFormValues(values);
  }, []);

  useDebounce(formValues, 400, (values) => {
    const hasAny = Object.values(values).some(
      (v) => (typeof v === 'string' && v.trim() !== '') || (typeof v === 'number' && v > 0)
    );
    if (!hasAny) return;
    dispatch(setSaving(true));
    dispatch(
      addOrUpdateDraft({
        ...values,
        id: currentDraftId ?? undefined,
      })
    );
  });

  const handleCreateDraft = useCallback(() => {
    dispatch(setSaving(true));
    dispatch(addOrUpdateDraft({ ...formValues }));
    setSnackbar({ message: 'Draft saved.', severity: 'success' });
  }, [formValues, dispatch]);

  const handleSelectDraft = useCallback(
    (draft: ServiceLogDraft) => {
      setFormValues({
        providerId: draft.providerId,
        serviceOrder: draft.serviceOrder,
        carId: draft.carId,
        odometer: draft.odometer,
        engineHours: draft.engineHours,
        startDate: draft.startDate,
        endDate: draft.endDate,
        type: draft.type,
        serviceDescription: draft.serviceDescription,
      });
      dispatch(setCurrentDraftId(draft.id));
    },
    [dispatch]
  );

  const handleDeleteDraft = useCallback(
    (id: string) => {
      dispatch(removeDraft(id));
      if (currentDraftId === id) {
        setFormValues({
          providerId: '',
          serviceOrder: '',
          carId: '',
          odometer: 0,
          engineHours: 0,
          startDate: todayISO(),
          endDate: tomorrowISO(),
          type: 'planned',
          serviceDescription: '',
        });
        dispatch(setCurrentDraftId(null));
      }
    },
    [currentDraftId, dispatch]
  );

  const handleClearAllDrafts = useCallback(() => {
    dispatch(clearAllDrafts());
    setFormValues({
      providerId: '',
      serviceOrder: '',
      carId: '',
      odometer: 0,
      engineHours: 0,
      startDate: todayISO(),
      endDate: tomorrowISO(),
      type: 'planned',
      serviceDescription: '',
    });
  }, [dispatch]);

  const handleCreateServiceLog = useCallback(() => {
    dispatch(
      addServiceLog({
        providerId: formValues.providerId,
        serviceOrder: formValues.serviceOrder,
        carId: formValues.carId,
        odometer: Number(formValues.odometer),
        engineHours: Number(formValues.engineHours),
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        type: formValues.type,
        serviceDescription: formValues.serviceDescription,
      })
    );
    setFormValues({
      providerId: '',
      serviceOrder: '',
      carId: '',
      odometer: 0,
      engineHours: 0,
      startDate: todayISO(),
      endDate: tomorrowISO(),
      type: 'planned',
      serviceDescription: '',
    });
    dispatch(setCurrentDraftId(null));
    setFormResetKey((k) => k + 1);
    setSnackbar({ message: 'Service log created.', severity: 'success' });
  }, [formValues, dispatch]);

  const handleEditSave = useCallback(
    (id: string, values: ServiceLogFormValues) => {
      dispatch(updateServiceLog({ id, ...values }));
      setEditLog(null);
      setSnackbar({ message: 'Service log updated.', severity: 'success' });
    },
    [dispatch]
  );

  const handleDeleteLog = useCallback(
    (id: string) => {
      if (window.confirm('Delete this service log?')) {
        dispatch(removeServiceLog(id));
        setSnackbar({ message: 'Service log deleted.', severity: 'info' });
      }
    },
    [dispatch]
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Service logs
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minHeight: 24 }}>
          {saving && (
            <Typography variant="body2" color="text.secondary">
              Saving...
            </Typography>
          )}
          {!saving && lastSavedAt && (
            <>
              <CheckCircleOutlineIcon color="success" fontSize="small" />
              <Typography variant="body2" color="success.main">
                Draft saved
              </Typography>
            </>
          )}
        </Box>
        <ServiceLogForm
          key={`${currentDraftId ?? 'new'}-${formResetKey}`}
          defaultValues={formValues}
          onSubmit={handleCreateServiceLog}
          onValuesChange={handleFormValuesChange}
          submitLabel="Create Service Log"
        />
      </Box>

      <DraftList
        drafts={drafts}
        currentDraftId={currentDraftId}
        onSelectDraft={handleSelectDraft}
        onDeleteDraft={handleDeleteDraft}
        onCreateDraft={handleCreateDraft}
        onClearAllDrafts={handleClearAllDrafts}
      />

      <ServiceLogsTable
        logs={serviceLogs}
        onEdit={setEditLog}
        onDelete={handleDeleteLog}
      />

      <EditServiceLogDialog
        open={Boolean(editLog)}
        log={editLog}
        onClose={() => setEditLog(null)}
        onSave={handleEditSave}
      />

      {snackbar && (
        <Snackbar
          open
          autoHideDuration={4000}
          onClose={() => setSnackbar(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbar(null)} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
