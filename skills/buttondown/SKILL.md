---
name: Buttondown Newsletter
description: This skill should be used when the user asks to "manage newsletters", "create an email draft", "list my drafts", "schedule a newsletter", "get email analytics", "check newsletter stats", "send a newsletter", "create buttondown draft", or mentions Buttondown newsletter management. Provides tools for creating, scheduling, and analyzing newsletter emails via the Buttondown API.
version: 1.0.0
---

# Buttondown Newsletter Management

This skill provides newsletter management through the Buttondown API. Use the included TypeScript client script to create drafts, schedule sends, list emails, and retrieve analytics.

## Script Location

The API client script is located at:

```
${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts
```

All commands should be run using this full path:

```bash
npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts <command> [options]
```

## Authentication

Set the `BUTTONDOWN_API_KEY` environment variable before running commands:

```bash
export BUTTONDOWN_API_KEY=your_api_key
```

## Available Commands

### list

List emails with optional status filtering.

```bash
npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts list
npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts list --status draft
npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts list --status scheduled
npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts list --status sent
```

Returns JSON with email IDs, subjects, status, created/sent dates, and basic analytics.

### create

Create a new email draft.

```bash
npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts create "Subject Line" "Email body content in markdown"
```

**Important:** Always confirm with the user before creating drafts. Show them the subject and content first.

### get

Get full details for a specific email.

```bash
npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts get <email-id>
```

### analytics

Retrieve analytics for a specific email.

```bash
npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts analytics <email-id>
```

Returns opens, clicks, unsubscribes, and rate percentages.

### schedule

Schedule an email for future delivery.

```bash
npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts schedule <email-id> "2024-03-27T10:00:00Z"
```

**Important:** Always confirm the scheduled time with the user. Show both the ISO timestamp and local time equivalent.

### unschedule

Revert a scheduled email back to draft status.

```bash
npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts unschedule <email-id>
```

### update

Update an existing email's subject or body.

```bash
npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts update <email-id> --subject "New Subject"
npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts update <email-id> --body "New content"
```

### delete

Delete an email permanently.

```bash
npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/buttondown/scripts/buttondown.ts delete <email-id>
```

**Important:** Always confirm deletion with the user - this action cannot be undone.

## Common Workflows

### Creating and Scheduling a Newsletter

1. Draft the content with the user
2. Create the draft using the create command
3. Note the returned email ID
4. Confirm scheduling time with user
5. Schedule using the schedule command with the ID

### Reviewing Newsletter Performance

1. List sent emails with `list --status sent`
2. Get analytics for emails of interest with `analytics <id>`
3. Compare open rates and click rates across newsletters

### Managing the Draft Queue

1. List drafts with `list --status draft`
2. Get details on specific drafts with `get <id>`
3. Update if needed with `update <id> --subject "..."`
4. Schedule when ready with `schedule <id> <datetime>`

## Response Format

All commands output JSON. Example list response:

```json
{
  "total": 5,
  "emails": [
    {
      "id": "abc123",
      "subject": "Weekly Update",
      "status": "sent",
      "created": "2024-03-20T10:00:00Z",
      "sent_at": "2024-03-20T14:00:00Z",
      "scheduled_for": null,
      "analytics": {
        "recipients": 150,
        "opens": 75,
        "clicks": 12
      }
    }
  ]
}
```

## Additional Resources

- **`${CLAUDE_PLUGIN_ROOT}/skills/buttondown/references/api-types.md`** - Complete TypeScript type definitions
- **`${CLAUDE_PLUGIN_ROOT}/skills/buttondown/examples/workflow.md`** - Detailed workflow examples
