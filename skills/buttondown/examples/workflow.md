# Buttondown Workflow Examples

Detailed examples of common newsletter management workflows.

## Example 1: Weekly Newsletter Creation

User wants to create and schedule a weekly newsletter.

### Step 1: Draft the Content

Work with the user to create the newsletter content:

```markdown
# This Week at Company

Welcome to our weekly update!

## Highlights
- Feature X launched
- Team grew by 2 members
- Q1 goals achieved

## What's Next
Stay tuned for more updates...
```

### Step 2: Create the Draft

```bash
npx ts-node buttondown.ts create "This Week at Company - March 2024" "# This Week at Company..."
```

Response:
```json
{
  "id": "abc123-def456",
  "subject": "This Week at Company - March 2024",
  "body": "# This Week at Company...",
  "status": "draft",
  "created_at": "2024-03-20T14:30:00Z"
}
```

### Step 3: Confirm Schedule with User

"I've created the draft. When would you like to send it? For example, Friday at 9am EST?"

### Step 4: Schedule the Email

```bash
npx ts-node buttondown.ts schedule abc123-def456 "2024-03-22T14:00:00Z"
```

## Example 2: Reviewing Newsletter Performance

User wants to see how recent newsletters performed.

### Step 1: List Sent Emails

```bash
npx ts-node buttondown.ts list --status sent
```

Response:
```json
{
  "total": 12,
  "emails": [
    {
      "id": "email-001",
      "subject": "February Newsletter",
      "status": "published",
      "created": "2024-02-15T10:00:00Z",
      "analytics": {
        "recipients": 1500,
        "opens": 450,
        "clicks": 75
      }
    }
  ]
}
```

### Step 2: Get Detailed Analytics

```bash
npx ts-node buttondown.ts analytics email-001
```

Response:
```json
{
  "opens": 450,
  "clicks": 75,
  "unsubscribes": 3,
  "open_rate": 30.0,
  "click_rate": 5.0,
  "unsubscribe_rate": 0.2,
  "recipients": 1500,
  "deliveries": 1498
}
```

### Step 3: Present Summary to User

"Your February Newsletter reached 1,500 subscribers with a 30% open rate and 5% click rate. Only 3 people unsubscribed (0.2%)."

## Example 3: Managing Draft Queue

User has multiple drafts and wants to organize them.

### Step 1: List All Drafts

```bash
npx ts-node buttondown.ts list --status draft
```

### Step 2: Review Specific Draft

```bash
npx ts-node buttondown.ts get draft-id-here
```

### Step 3: Update Draft if Needed

```bash
npx ts-node buttondown.ts update draft-id-here --subject "Updated Subject Line"
```

### Step 4: Delete Unwanted Draft

Always confirm with user first:

"Are you sure you want to delete the draft 'Old Draft Title'? This cannot be undone."

```bash
npx ts-node buttondown.ts delete draft-id-here
```

## Example 4: Rescheduling an Email

User wants to change when a scheduled email will send.

### Step 1: List Scheduled Emails

```bash
npx ts-node buttondown.ts list --status scheduled
```

### Step 2: Unschedule the Email

```bash
npx ts-node buttondown.ts unschedule email-id-here
```

### Step 3: Reschedule with New Time

```bash
npx ts-node buttondown.ts schedule email-id-here "2024-03-25T15:00:00Z"
```

## Time Zone Notes

The Buttondown API uses UTC timestamps. When working with users:

1. Ask for their preferred time zone
2. Convert their local time to UTC for the API
3. Display times back in their local zone

Example conversion (EST to UTC):
- User says: "Friday at 9am EST"
- EST is UTC-5
- API time: "2024-03-22T14:00:00Z" (9am + 5 hours)

## Error Handling

### Invalid Email ID

```json
{
  "detail": "Not found."
}
```

Action: Verify the email ID by listing emails first.

### Missing API Key

```
Error: Buttondown API key is required. Set BUTTONDOWN_API_KEY environment variable.
```

Action: Ensure the environment variable is set.

### Invalid Date Format

Use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`

Example: `2024-03-27T10:00:00Z`
