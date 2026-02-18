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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit service log</DialogTitle>
      <DialogContent>
        <ServiceLogForm
          key={log?.id}
          formId="edit-service-log-form"
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" type="submit" form="edit-service-log-form">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditServiceLogDialog;
