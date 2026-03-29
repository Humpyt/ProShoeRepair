---
name: avoid-destructive-changes
description: Don't delete functionality or remove pages unless explicitly requested
type: feedback
---

**Rule:** Do NOT delete functionality, remove pages, or make destructive changes to the codebase unless the user explicitly asks for it.

**Why:** The user had financial summary cards and other functionality on the OperationPage that I accidentally removed during edits. Restoring it took significant time.

**How to apply:**
- Before editing a file, read its current state to understand what exists
- When adding new features, preserve all existing functionality
- If uncertain about what existing code does, ask before modifying
- When using git checkout to restore files, be very careful - communicate what was lost
- When delegating to agents, be explicit that existing functionality must be preserved
