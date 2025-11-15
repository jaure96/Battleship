# Match Data Cleanup

## Overview

This document describes the automatic data cleanup mechanism implemented for cancelled and finished Battleship matches. The cleanup ensures that the database remains clean by removing all associated player and move data when a match ends.

## Implementation Details

### Database Functions

#### 1. `rpc_cancel_match`

**Purpose**: Cancels a match and cleans up all associated data.

**Parameters**:

- `p_match_id` (uuid): The ID of the match to cancel

**Behavior**:

1. Updates the match status to `'cancelled'`
2. Deletes all moves associated with the match from the `moves` table
3. Deletes all match players associated with the match from the `match_players` table
4. Returns the updated match record

**When Called**:

- When a player initiates quit action during an active match
- When called via `useQuitMatch` hook in the mobile app

```sql
-- Example usage
await supabase.rpc("rpc_cancel_match", {
  p_match_id: matchId
});
```

#### 2. `rpc_cleanup_finished_match`

**Purpose**: Cleans up data from a finished match.

**Parameters**:

- `p_match_id` (uuid): The ID of the match to clean up

**Behavior**:

1. Validates that the match exists
2. Validates that the match status is `'finished'`
3. Deletes all moves associated with the match from the `moves` table
4. Deletes all match players associated with the match from the `match_players` table
5. Returns the updated match record

**When Called**:

- After a match finishes and the winner/loser sees the result dialog
- Triggered by the `useWinMatch` hook before navigating away

```sql
-- Example usage
await supabase.rpc("rpc_cleanup_finished_match", {
  p_match_id: matchId
});
```

### Frontend Integration

#### `useWinMatch` Hook

The `useWinMatch` hook handles match end scenarios and calls the cleanup function:

```typescript
const cleanupMatchData = useCallback(async () => {
  if (!match?.id || !supabase) return;
  try {
    await supabase.rpc("rpc_cleanup_finished_match", {
      p_match_id: match.id,
    });
  } catch (error) {
    console.error("Error cleaning up finished match:", error);
    // Continue navigation even if cleanup fails
  }
}, [match?.id, supabase]);

const onConfirm = useCallback(async () => {
  // Cleanup match data before navigating
  await cleanupMatchData();

  // Show ad or navigate
  if (adLoaded) {
    interstitial.show();
  } else {
    navigate("index");
  }
}, [adLoaded, interstitial, navigate, cleanupMatchData]);
```

**Key Features**:

- Cleanup happens automatically when the player confirms the match end dialog
- Cleanup is performed before navigation to ensure data is cleaned
- Errors during cleanup don't prevent navigation (graceful degradation)

#### `useQuitMatch` Hook

The `useQuitMatch` hook handles match cancellation:

```typescript
const cleanupCancelledMatch = async (matchId: string) => {
  if (!supabase) return;
  try {
    // The rpc_cancel_match function now handles the cleanup
    await cancelMatch(matchId);
  } catch (error) {
    console.error("Error cancelling match:", error);
  }
};

const onConfirm = async (withCancel = true) => {
  if (match && withCancel) {
    await cleanupCancelledMatch(match.id);
  }
  closeDialog();
  navigate("index");
};
```

**Key Features**:

- Cleanup is integrated into the cancel match workflow
- Cleanup happens before navigation back to home

## Data Flow

### Match Cancellation Flow

```
Player initiates quit
    ↓
useQuitMatch hook triggered
    ↓
Display quit confirmation dialog
    ↓
Player confirms quit
    ↓
cancelMatch(matchId) called
    ↓
rpc_cancel_match executes
    ↓
Match status → 'cancelled'
moves table → records deleted
match_players table → records deleted
    ↓
Navigate to home screen
```

### Match Finish Flow

```
Last opponent ship sunk
    ↓
rpc_make_move sets status → 'finished'
winner_player_id set
    ↓
useWinMatch hook detects status change
    ↓
Display match result dialog (Victory/Defeat)
    ↓
Player confirms result
    ↓
cleanupMatchData() called
    ↓
rpc_cleanup_finished_match executes
    ↓
moves table → records deleted
match_players table → records deleted
    ↓
Display ad (if loaded)
    ↓
Navigate to home screen
```

## Database Constraints

The cleanup operations rely on PostgreSQL's ON DELETE CASCADE constraints:

```sql
-- match_players table
CREATE TABLE public.match_players (
  id uuid NOT NULL,
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  ...
);

-- moves table
CREATE TABLE public.moves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  ...
);
```

The foreign key constraints ensure that if a match is deleted, all related records are automatically removed.

## Benefits

1. **Database Cleanliness**: Prevents accumulation of orphaned data from completed matches
2. **Storage Optimization**: Reduces database storage by removing unnecessary historical data
3. **Performance**: Smaller table sizes lead to faster queries on active matches
4. **User Privacy**: Automatically removes game data after matches conclude
5. **Resource Management**: Prevents unbounded growth of match-related tables

## Error Handling

Both cleanup functions include error handling:

- **In Database**: Functions validate match existence and status before deleting
- **In Frontend**: Cleanup errors are caught and logged but don't prevent user navigation
- **Graceful Degradation**: If cleanup fails, the user can still navigate away from the match

## Testing Considerations

When testing the cleanup functionality:

1. Verify that `match_players` records are deleted when a match is cancelled
2. Verify that `moves` records are deleted when a match is cancelled
3. Verify that `match_players` records are deleted when a match finishes
4. Verify that `moves` records are deleted when a match finishes
5. Verify that cleanup errors don't break the UI navigation flow
6. Verify that match record itself is preserved (only associated data is deleted)

## Future Enhancements

- Add cleanup event logging for analytics
- Implement soft deletes with archive tables for match history retention
- Add scheduled cleanup jobs for matches without proper closure
- Implement match data retention policies based on match type
