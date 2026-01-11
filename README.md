# Buttondown Skill

A Claude Code plugin skill for managing Buttondown newsletters. Create drafts, schedule emails, view analytics, and manage your newsletter directly through Claude.

## Installation

Add this plugin to your Claude Code configuration:

```bash
claude --plugin-dir /path/to/buttondown-skill
```

## Configuration

Set your Buttondown API key as an environment variable:

```bash
export BUTTONDOWN_API_KEY=your_api_key
```

## Usage

Once installed, Claude will automatically use this skill when you ask about newsletter management. Examples:

- "List my draft newsletters"
- "Create a newsletter draft about our product launch"
- "Schedule my latest draft for Friday at 9am"
- "How did my last newsletter perform?"
- "Show analytics for my sent emails"

## Features

- **List emails** - View drafts, scheduled, or sent newsletters
- **Create drafts** - Write newsletter content in markdown
- **Schedule sends** - Set delivery time for newsletters
- **View analytics** - Check open rates, clicks, and engagement
- **Update emails** - Modify subject lines and content
- **Delete emails** - Remove unwanted drafts

## Structure

```
buttondown-skill/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── buttondown/
│       ├── SKILL.md
│       ├── scripts/
│       │   └── buttondown.ts
│       ├── references/
│       │   └── api-types.md
│       └── examples/
│           └── workflow.md
└── README.md
```

## License

ISC
