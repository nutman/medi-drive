import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import type { ServiceLog } from '../types/serviceLog';
import { SERVICE_LOG_TYPES, type ServiceLogType } from '../types/serviceLog';

export interface ServiceLogsTableProps {
  logs: ServiceLog[];
  onEdit: (log: ServiceLog) => void;
  onDelete: (log: ServiceLog) => void;
}

export function ServiceLogsTable({ logs, onEdit, onDelete }: ServiceLogsTableProps) {
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [typeFilter, setTypeFilter] = useState<ServiceLogType | ''>('');

  const filteredLogs = useMemo(() => {
    let result = [...logs];
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (log) =>
          log.providerId.toLowerCase().includes(q) ||
          log.serviceOrder.toLowerCase().includes(q) ||
          log.carId.toLowerCase().includes(q) ||
          log.serviceDescription.toLowerCase().includes(q)
      );
    }
    if (dateFrom) {
      result = result.filter((log) => log.startDate >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((log) => log.startDate <= dateTo);
    }
    if (typeFilter) {
      result = result.filter((log) => log.type === typeFilter);
    }
    return result;
  }, [logs, search, dateFrom, dateTo, typeFilter]);

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3, mb: 0.25 }}>
          Service logs
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
          Search and filter by date range or type. Edit or delete from the table.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          gap: 2,
          mb: 2,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <TextField
          size="small"
          label="Search"
          placeholder="Provider, order, car, description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <TextField
          size="small"
          label="Start date from"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 160, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <TextField
          size="small"
          label="Start date to"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 160, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <FormControl size="small" sx={{ minWidth: 140, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value as ServiceLogType | '')}
          >
            <MenuItem value="">All</MenuItem>
            {SERVICE_LOG_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover', fontSize: '0.8125rem' }}>Provider</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover', fontSize: '0.8125rem' }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover', fontSize: '0.8125rem' }}>Car</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, bgcolor: 'action.hover', fontSize: '0.8125rem' }}>Odometer</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, bgcolor: 'action.hover', fontSize: '0.8125rem' }}>Engine h</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover', fontSize: '0.8125rem' }}>Start</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover', fontSize: '0.8125rem' }}>End</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover', fontSize: '0.8125rem' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover', fontSize: '0.8125rem' }}>Description</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, bgcolor: 'action.hover', fontSize: '0.8125rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4, color: 'text.secondary', fontSize: '0.9375rem' }}>
                  No service logs match the filters. Create one with the form above.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>{log.providerId}</TableCell>
                  <TableCell>{log.serviceOrder}</TableCell>
                  <TableCell>{log.carId}</TableCell>
                  <TableCell align="right">{log.odometer}</TableCell>
                  <TableCell align="right">{log.engineHours}</TableCell>
                  <TableCell>{log.startDate}</TableCell>
                  <TableCell>{log.endDate}</TableCell>
                  <TableCell>{log.type}</TableCell>
                  <TableCell sx={{ maxWidth: 200, fontSize: '0.875rem', lineHeight: 1.4 }}>{log.serviceDescription}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => onEdit(log)} aria-label="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(log)} aria-label="Delete">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ServiceLogsTable;
