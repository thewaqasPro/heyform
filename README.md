<br /><br />

<div align="center">
  <h1 align="center">
    <b>KyndForm</b>
  </h1>
  <p><b>Open-source form builder, built for modern teams and seamless workflows </b> </p>
</div>

<img src="./assets/images/screenshot.png" alt="KyndForm" />

## Features

KyndForm simplifies the creation of conversational and classic forms, making it accessible for anyone to gather information, conduct surveys, and capture leads with zero coding required.

### Build Forms with Ease

- **Versatile Inputs**: From text, email, phone numbers, and dropdowns to signatures, ratings, and file uploads.
- **Smart Logic & Variables**: Conditional branching logic, multi-step actions, and score calculations.
- **Headless & Dynamic**: Powerful headless endpoints with auto-schema discovery for programmatic submissions.
- **Integrations**: Connect with webhooks, Zapier, Slack, Discord, Lark Suite, Telegram, Google Sheets, and email alerts.

### Customize to Your Brand

- **Visual Themes**: Tailor the look and feel of your forms with customizable colors, fonts, layouts, and custom CSS.
- **Custom Domains & Embeds**: Seamless embedding with standard, modal, popup, and full-page modes.

### Analyze and Act on Data

- **Deep Analytics**: Track impressions, start rates, drop-offs, and completion rates.
- **Export & Webhooks**: Export submissions to CSV and stream real-time events.

## Monorepo Structure

```
.
└── packages
    ├── answer-utils       (@kyndform/answer-utils: submission validation & parsers)
    ├── embed              (@kyndform/embed: embed JavaScript library)
    ├── form-renderer      (@kyndform/form-renderer: form UI rendering components)
    ├── shared-types-enums (@kyndform/shared-types-enums: shared types and constants)
    ├── utils              (@kyndform/utils: shared utilities)
    ├── server             (kyndform-server: NestJS backend API & GraphQL engine)
    └── webapp             (kyndform-webapp: React frontend builder & dashboard)
```

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js >= 20
- pnpm >= 8
- MongoDB & Redis

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Build Packages
```bash
pnpm build:server
pnpm build:webapp
```

### 4. Run Development Servers
```bash
pnpm dev
```

## License

KyndForm is open-source under the GNU Affero General Public License v3.0 (AGPL-3.0).
