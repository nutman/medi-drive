import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { ServiceLogForm } from './ServiceLogForm';
import type { ServiceLog } from '../types/serviceLog';
import type { ServiceLogFormValues } from '../types/serviceLog';

export interface EditServiceLogDialogProps {
  open: boolean;
  log: ServiceLog | null;
  onClose: () => void;
  onSave: (id: string, values: ServiceLogFormValues) => void;
}

export function EditServiceLogDialog({ open, log, onClose, onSave }: EditServiceLogDialogProps) {
  const defaultValues: Partial<ServiceLogFormValues> | undefined = log
    ? {
        providerId: log.providerId,
        serviceOrder: log.serviceOrder,
        carId: log.carId,
        odometer: log.odometer,
        engineHours: log.engineHours,
        startDate: log.startDate,
        endDate: log.endDate,
        type: log.type,
        serviceDescription: log.serviceDescription,
      }
    : undefined;

  const handleSubmit = (values: ServiceLogFormValues) => {
    if (log) {
      onSave(log.id, values);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
        Edit service log
      </DialogTitle>
      <DialogContent sx={{ pt: 0, pb: 2 }}>
        <ServiceLogForm
          key={log?.id}
          formId="edit-service-log-form"
          formTitle={null}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button variant="contained" type="submit" form="edit-service-log-form" sx={{ borderRadius: 2 }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditServiceLogDialog;
