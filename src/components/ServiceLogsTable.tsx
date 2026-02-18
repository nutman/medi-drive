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
  onDelete: (id: string) => void;
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
      <Typography variant="h6" gutterBottom>
        Service logs
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <TextField
          size="small"
          label="Search (provider, order, car, description)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280 }}
        />
        <TextField
          size="small"
          label="Start date from"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 160 }}
        />
        <TextField
          size="small"
          label="Start date to"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 160 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
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
      <TableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Provider</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Car</TableCell>
              <TableCell align="right">Odometer</TableCell>
              <TableCell align="right">Engine h</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                  No service logs match the filters.
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
                  <TableCell sx={{ maxWidth: 200 }}>{log.serviceDescription}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => onEdit(log)} aria-label="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(log.id)} aria-label="Delete">
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
