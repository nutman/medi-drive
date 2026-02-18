import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
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
import { getDefaultFormValues } from '../constants/formDefaults';

function useDebounce<T>(value: T, delay: number, onDebounced: (v: T) => void) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirst = useRef(true);
  const onDebouncedRef = useRef(onDebounced);
  onDebouncedRef.current = onDebounced;

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    timeoutRef.current = setTimeout(() => {
      onDebouncedRef.current(value);
    }, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, delay]);
}

export default function ServiceLogsPage() {
  const dispatch = useAppDispatch();
  const { items: drafts, currentDraftId, saving, lastSavedAt } = useAppSelector((s) => s.drafts);
  const serviceLogs = useAppSelector((s) => s.serviceLogs);

  const [formValues, setFormValues] = useState<ServiceLogFormValues>(getDefaultFormValues);
  const [editLog, setEditLog] = useState<ServiceLog | null>(null);
  const [deleteLog, setDeleteLog] = useState<ServiceLog | null>(null);
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
        setFormValues(getDefaultFormValues());
        dispatch(setCurrentDraftId(null));
      }
    },
    [currentDraftId, dispatch]
  );

  const handleClearAllDrafts = useCallback(() => {
    dispatch(clearAllDrafts());
    setFormValues(getDefaultFormValues());
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
    setFormValues(getDefaultFormValues());
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

  const handleDeleteLogRequest = useCallback((log: ServiceLog) => {
    setDeleteLog(log);
  }, []);

  const handleConfirmDeleteLog = useCallback(() => {
    if (deleteLog) {
      dispatch(removeServiceLog(deleteLog.id));
      setSnackbar({ message: 'Service log deleted.', severity: 'info' });
      setDeleteLog(null);
    }
  }, [deleteLog, dispatch]);

  const handleCancelDeleteLog = useCallback(() => {
    setDeleteLog(null);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 960, marginLeft: 'auto', marginRight: 'auto' }}>
      <Box component="header" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25, mb: 0.5 }}>
          Service logs
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9375rem', lineHeight: 1.5 }}>
          Create and manage service logs. Drafts are saved automatically.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            mb: 1.5,
            minHeight: 24,
            display: 'flex',
            alignItems: 'center',
            pl: 0.5,
          }}
        >
          {saving && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Saving…
            </Typography>
          )}
          {!saving && lastSavedAt && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleOutlineIcon color="success" fontSize="small" />
              <Typography variant="body2" color="success.main" fontWeight={500}>
                Draft saved
              </Typography>
            </Box>
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
        onDelete={handleDeleteLogRequest}
      />

      <Dialog
        open={Boolean(deleteLog)}
        onClose={handleCancelDeleteLog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle id="delete-dialog-title">Delete service log?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            This action cannot be undone. The service log will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 0, gap: 1 }}>
          <Button onClick={handleCancelDeleteLog} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteLog}
            sx={{ borderRadius: 2 }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}
