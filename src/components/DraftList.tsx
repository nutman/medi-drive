import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ServiceLogDraft } from '../types/serviceLog';

export interface DraftListProps {
  drafts: ServiceLogDraft[];
  currentDraftId: string | null;
  onSelectDraft: (draft: ServiceLogDraft) => void;
  onDeleteDraft: (id: string) => void;
  onCreateDraft: () => void;
  onClearAllDrafts: () => void;
}

export function DraftList({
  drafts,
  currentDraftId,
  onSelectDraft,
  onDeleteDraft,
  onCreateDraft,
  onClearAllDrafts,
}: DraftListProps) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Drafts
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Button variant="outlined" size="small" onClick={onCreateDraft}>
          Create Draft
        </Button>
        <Button variant="outlined" size="small" color="error" onClick={onClearAllDrafts} disabled={drafts.length === 0}>
          Clear All Drafts
        </Button>
      </Box>
      <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
        {drafts.length === 0 ? (
          <ListItem>
            <ListItemText primary="No drafts" secondary="Create a draft to save your form for later." />
          </ListItem>
        ) : (
          drafts.map((draft) => (
            <ListItem
              key={draft.id}
              onClick={() => onSelectDraft(draft)}
              sx={{
                cursor: 'pointer',
                bgcolor: currentDraftId === draft.id ? 'action.selected' : undefined,
                '&:hover': { bgcolor: 'action.hover' },
              }}
              secondaryAction={
                <ListItemSecondaryAction>
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                  <IconButton edge="end" size="small" onClick={(e) => { e.stopPropagation(); onDeleteDraft(draft.id); }} aria-label="Delete draft">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              }
            >
              <ListItemText
                primary={`${draft.serviceOrder || 'Untitled'} – ${draft.providerId || '—'}`}
                secondary={new Date(draft.updatedAt).toLocaleString()}
              />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
}

export default DraftList;
