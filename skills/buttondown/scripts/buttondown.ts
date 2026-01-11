#!/usr/bin/env npx tsx
/**
 * Buttondown API Client
 *
 * A self-contained TypeScript client for the Buttondown newsletter API.
 *
 * Usage:
 *   npx tsx buttondown.ts <command> [options]
 *
 * Commands:
 *   list [--status draft|scheduled|sent]  List emails
 *   create <title> <content>              Create a draft
 *   analytics <email-id>                  Get email analytics
 *   schedule <email-id> <iso-datetime>    Schedule an email
 *
 * Environment:
 *   BUTTONDOWN_API_KEY - Your Buttondown API key
 */

// Types
interface ButtondownEmail {
  id: string;
  subject: string;
  body: string;
  status: "draft" | "scheduled" | "published" | "sent";
  created_at: string;
  updated_at: string;
  scheduled_for?: string | null;
  published_at?: string;
  creation_date?: string;
  modification_date?: string;
  publish_date?: string;
  sent_at?: string;
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

interface ButtondownEmailsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ButtondownEmail[];
}

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

interface APIError {
  detail: string;
}

// API Client
class ButtondownAPI {
  private apiKey: string;
  private baseUrl = "https://api.buttondown.email/v1";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.BUTTONDOWN_API_KEY || "";
    if (!this.apiKey) {
      throw new Error(
        "Buttondown API key is required. Set BUTTONDOWN_API_KEY environment variable."
      );
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Token ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = (await response.json()) as APIError;
      throw new Error(error.detail || `API request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async listEmails(status?: "draft" | "scheduled" | "sent"): Promise<ButtondownEmailsResponse> {
    const endpoint = status ? `/emails?status=${status}` : "/emails";
    return this.request<ButtondownEmailsResponse>(endpoint);
  }

  async listDrafts(): Promise<ButtondownEmailsResponse> {
    return this.request<ButtondownEmailsResponse>("/emails?status=draft");
  }

  async listScheduledEmails(): Promise<ButtondownEmailsResponse> {
    return this.request<ButtondownEmailsResponse>("/emails?status=scheduled");
  }

  async listSentEmails(): Promise<ButtondownEmailsResponse> {
    return this.request<ButtondownEmailsResponse>("/emails?status=sent");
  }

  async createDraft(content: string, title?: string): Promise<ButtondownEmail> {
    return this.request<ButtondownEmail>("/emails", {
      method: "POST",
      body: JSON.stringify({
        body: content,
        subject: title || "Untitled Draft",
        status: "draft",
      }),
    });
  }

  async getAnalytics(emailId: string): Promise<ButtondownAnalytics> {
    return this.request<ButtondownAnalytics>(`/emails/${emailId}/analytics`);
  }

  async getEmail(emailId: string): Promise<ButtondownEmail> {
    return this.request<ButtondownEmail>(`/emails/${emailId}`);
  }

  async scheduleDraft(
    draftId: string,
    scheduledTime: string
  ): Promise<ButtondownEmail> {
    return this.request<ButtondownEmail>(`/emails/${draftId}`, {
      method: "PATCH",
      body: JSON.stringify({
        scheduled_for: scheduledTime,
        publish_date: scheduledTime,
        status: "scheduled",
      }),
    });
  }

  async unscheduleDraft(draftId: string): Promise<ButtondownEmail> {
    return this.request<ButtondownEmail>(`/emails/${draftId}`, {
      method: "PATCH",
      body: JSON.stringify({
        scheduled_for: null,
        status: "draft",
      }),
    });
  }

  async updateEmail(
    emailId: string,
    updates: { subject?: string; body?: string }
  ): Promise<ButtondownEmail> {
    return this.request<ButtondownEmail>(`/emails/${emailId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteEmail(emailId: string): Promise<void> {
    await this.request<void>(`/emails/${emailId}`, {
      method: "DELETE",
    });
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(`
Buttondown CLI

Usage:
  buttondown.ts <command> [options]

Commands:
  list [--status draft|scheduled|sent]  List emails
  create <title> <content>              Create a draft
  analytics <email-id>                  Get email analytics
  schedule <email-id> <iso-datetime>    Schedule an email
  unschedule <email-id>                 Unschedule an email
  get <email-id>                        Get email details
  update <email-id> [--subject] [--body] Update an email
  delete <email-id>                     Delete an email

Environment:
  BUTTONDOWN_API_KEY - Your Buttondown API key
`);
    process.exit(0);
  }

  const api = new ButtondownAPI();

  try {
    switch (command) {
      case "list": {
        const statusIdx = args.indexOf("--status");
        const status = statusIdx !== -1 ? args[statusIdx + 1] as "draft" | "scheduled" | "sent" : undefined;
        const response = await api.listEmails(status);
        console.log(JSON.stringify({
          total: response.count,
          emails: response.results.map(email => ({
            id: email.id,
            subject: email.subject || "Untitled",
            status: email.status,
            created: email.creation_date || email.created_at,
            sent_at: email.publish_date || email.published_at || null,
            scheduled_for: email.scheduled_for || null,
            analytics: email.analytics ? {
              recipients: email.analytics.recipients,
              opens: email.analytics.opens,
              clicks: email.analytics.clicks,
            } : null,
          })),
        }, null, 2));
        break;
      }

      case "create": {
        const title = args[1];
        const content = args[2];
        if (!content) {
          console.error("Usage: create <title> <content>");
          process.exit(1);
        }
        const draft = await api.createDraft(content, title);
        console.log(JSON.stringify(draft, null, 2));
        break;
      }

      case "analytics": {
        const emailId = args[1];
        if (!emailId) {
          console.error("Usage: analytics <email-id>");
          process.exit(1);
        }
        const analytics = await api.getAnalytics(emailId);
        console.log(JSON.stringify(analytics, null, 2));
        break;
      }

      case "schedule": {
        const draftId = args[1];
        const scheduledTime = args[2];
        if (!draftId || !scheduledTime) {
          console.error("Usage: schedule <email-id> <iso-datetime>");
          process.exit(1);
        }
        const scheduled = await api.scheduleDraft(draftId, scheduledTime);
        console.log(JSON.stringify(scheduled, null, 2));
        break;
      }

      case "unschedule": {
        const draftId = args[1];
        if (!draftId) {
          console.error("Usage: unschedule <email-id>");
          process.exit(1);
        }
        const unscheduled = await api.unscheduleDraft(draftId);
        console.log(JSON.stringify(unscheduled, null, 2));
        break;
      }

      case "get": {
        const emailId = args[1];
        if (!emailId) {
          console.error("Usage: get <email-id>");
          process.exit(1);
        }
        const email = await api.getEmail(emailId);
        console.log(JSON.stringify(email, null, 2));
        break;
      }

      case "update": {
        const emailId = args[1];
        if (!emailId) {
          console.error("Usage: update <email-id> [--subject <subject>] [--body <body>]");
          process.exit(1);
        }
        const updates: { subject?: string; body?: string } = {};
        const subjectIdx = args.indexOf("--subject");
        if (subjectIdx !== -1) updates.subject = args[subjectIdx + 1];
        const bodyIdx = args.indexOf("--body");
        if (bodyIdx !== -1) updates.body = args[bodyIdx + 1];
        const updated = await api.updateEmail(emailId, updates);
        console.log(JSON.stringify(updated, null, 2));
        break;
      }

      case "delete": {
        const emailId = args[1];
        if (!emailId) {
          console.error("Usage: delete <email-id>");
          process.exit(1);
        }
        await api.deleteEmail(emailId);
        console.log(`Email ${emailId} deleted`);
        break;
      }

      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run if executed directly
main();
