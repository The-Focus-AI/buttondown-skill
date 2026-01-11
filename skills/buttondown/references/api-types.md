# Buttondown API Types

Complete TypeScript type definitions for the Buttondown API.

## Email Types

### ButtondownEmail

The main email object returned by the API.

```typescript
interface ButtondownEmail {
  id: string;
  subject: string;
  body: string;
  status: "draft" | "scheduled" | "published";
  created_at: string;
  updated_at: string;
  scheduled_for?: string | null;
  published_at?: string;
  creation_date?: string;
  modification_date?: string;
  publish_date?: string;
  analytics?: {
    recipients?: number;
    deliveries?: number;
    opens?: number;
    clicks?: number;
    open_rate?: number;
    click_rate?: number;
    unsubscribe_rate?: number;
  };
}
```

### ButtondownEmailsResponse

Paginated response for listing emails.

```typescript
interface ButtondownEmailsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ButtondownEmail[];
}
```

## Analytics Types

### ButtondownAnalytics

Detailed analytics for a specific email.

```typescript
interface ButtondownAnalytics {
  opens: number;
  clicks: number;
  unsubscribes: number;
  open_rate: number;
  click_rate: number;
  unsubscribe_rate: number;
  recipients?: number;
  deliveries?: number;
}
```

## API Endpoints

Base URL: `https://api.buttondown.email/v1`

### Emails

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/emails` | List all emails |
| GET | `/emails?status=draft` | List drafts |
| GET | `/emails?status=scheduled` | List scheduled |
| GET | `/emails?status=sent` | List sent |
| GET | `/emails/{id}` | Get email by ID |
| POST | `/emails` | Create email |
| PATCH | `/emails/{id}` | Update email |
| DELETE | `/emails/{id}` | Delete email |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/emails/{id}/analytics` | Get email analytics |

## Authentication

All requests require the `Authorization` header:

```
Authorization: Token your_api_key
```

## Request/Response Examples

### Create Draft Request

```json
POST /emails
{
  "body": "Newsletter content in markdown",
  "subject": "Email Subject",
  "status": "draft"
}
```

### Schedule Email Request

```json
PATCH /emails/{id}
{
  "scheduled_for": "2024-03-27T10:00:00Z",
  "publish_date": "2024-03-27T10:00:00Z",
  "status": "scheduled"
}
```

### Unschedule Email Request

```json
PATCH /emails/{id}
{
  "scheduled_for": null,
  "status": "draft"
}
```

### Update Email Request

```json
PATCH /emails/{id}
{
  "subject": "New Subject",
  "body": "Updated content"
}
```
