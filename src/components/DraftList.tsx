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
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3, mb: 0.25 }}>
            Drafts
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
            Saved drafts you can resume. Select one to load it into the form above.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
          <Button variant="outlined" onClick={onCreateDraft} sx={{ borderRadius: 2 }}>
            Create Draft
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={onClearAllDrafts}
            disabled={drafts.length === 0}
            sx={{ borderRadius: 2 }}
          >
            Clear All Drafts
          </Button>
        </Box>
      </Box>
      <List
        dense
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          py: 0,
          overflow: 'hidden',
        }}
      >
        {drafts.length === 0 ? (
          <ListItem sx={{ py: 3, px: 2 }}>
            <ListItemText
              primary="No drafts yet"
              primaryTypographyProps={{ fontWeight: 500, sx: { mb: 0.25 } }}
              secondary="Use “Create Draft” above to save the current form and resume later."
              secondaryTypographyProps={{ color: 'text.secondary', variant: 'body2', sx: { lineHeight: 1.45 } }}
            />
          </ListItem>
        ) : (
          drafts.map((draft) => (
            <ListItem
              key={draft.id}
              onClick={() => onSelectDraft(draft)}
              sx={{
                cursor: 'pointer',
                py: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-of-type': { borderBottom: 'none' },
                bgcolor: currentDraftId === draft.id ? 'action.selected' : undefined,
                '&:hover': { bgcolor: 'action.hover' },
              }}
              secondaryAction={
                <ListItemSecondaryAction>
                  {currentDraftId === draft.id && (
                    <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                  )}
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDraft(draft.id);
                    }}
                    aria-label="Delete draft"
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              }
            >
              <ListItemText
                primary={`${draft.serviceOrder || 'Untitled'} – ${draft.providerId || '—'}`}
                primaryTypographyProps={{ fontWeight: 500 }}
                secondary={new Date(draft.updatedAt).toLocaleString()}
                secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
}

export default DraftList;
