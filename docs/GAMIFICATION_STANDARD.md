# Gamification Standard: "Duolingo for Coffee"

## The Core Philosophy
"Every meaningful user action must be rewarded with XP to drive Current User Retention Rate (CURR)."

We are elevating the gamification system from just the learning module to a global app-wide feature. Every meaningful interaction will now contribute to the user's XP and Daily Streak.

## XP Action Dictionary
A centralized mapping of actions to their XP rewards:

| Action | XP Reward | Description |
| :--- | :--- | :--- |
| `complete_lesson` | 15 XP | Completing a learning lesson |
| `scan_coffee_bag` | 10 XP | Successfully scanning a new coffee bag |
| `log_brew_recipe` | 20 XP | Creating and logging a new brew recipe |
| `rate_coffee` | 5 XP | Submitting a rating/review for a coffee |
| `perfect_lesson_bonus` | 5 XP | Bonus for answering all questions correctly in a lesson |

## Implementation Rule
**Whenever a new feature is built, the developer MUST hook its success state into the global `useXP` and `useStreak` hooks to reward the user.**
