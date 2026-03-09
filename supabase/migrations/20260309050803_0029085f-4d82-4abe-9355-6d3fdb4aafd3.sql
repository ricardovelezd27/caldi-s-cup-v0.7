-- One-time fix: sync profiles.total_xp to include lesson XP from learning_user_streaks
-- that was never synced before the code fix
UPDATE profiles p
SET total_xp = COALESCE(p.total_xp, 0) + COALESCE(s.total_xp, 0)
FROM learning_user_streaks s
WHERE s.user_id = p.id
AND s.total_xp > 0;