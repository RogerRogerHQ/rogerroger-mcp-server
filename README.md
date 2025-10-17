# RogerRoger MCP Server

A Model Context Protocol (MCP) server for the [RogerRoger API](https://developer.rogerroger.io/). This server allows AI assistants like Claude to interact with your RogerRoger data through standardized MCP tools.

## Features

- 🧑‍🤝‍🧑 **People Management**: Create, read, update, and delete contacts
- ✅ **Task Management**: Create and retrieve tasks
- 🔐 **Secure Authentication**: Uses API keys for secure access
- 📊 **Pagination Support**: Handle large datasets efficiently

## Installation

### Prerequisites

- Node.js 18 or higher
- A RogerRoger account with API access
- RogerRoger API key (get one from [your admin panel](https://app.rogerroger.io/admin/api))

### Option 1: Install from npm (Recommended)

Once published, you can install globally:

```bash
npm install -g rogerroger-mcp-server
```

### Option 2: Install from source

```bash
git clone https://github.com/yourusername/rogerroger-mcp-server.git
cd rogerroger-mcp-server
npm install
npm run build
```

## Setup with Claude Desktop

### Step 1: Get Your API Key

1. Log in to your RogerRoger account
2. Navigate to [Admin Panel > API](https://app.rogerroger.io/admin/api)
3. Generate or copy your API key

### Step 2: Configure Claude Desktop

Locate your Claude Desktop configuration file:

- **MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

Add the RogerRoger MCP server configuration:

```json
{
  "mcpServers": {
    "rogerroger": {
      "command": "npx",
      "args": ["-y", "rogerroger-mcp-server"],
      "env": {
        "ROGERROGER_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Note**: If you installed from source instead of npm, replace the configuration with:

```json
{
  "mcpServers": {
    "rogerroger": {
      "command": "node",
      "args": ["/absolute/path/to/rogerroger-mcp-server/dist/index.js"],
      "env": {
        "ROGERROGER_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Step 3: Restart Claude Desktop

After saving the configuration file, restart Claude Desktop completely (quit and reopen).

### Step 4: Verify Installation

In Claude Desktop, you should see the RogerRoger MCP server connection indicator. You can now use commands like:

- "Show me all my contacts in RogerRoger"
- "Create a new contact named John Doe with email john@example.com"
- "List all my tasks"

## Configuration Options

The following environment variables can be configured:

| Variable             | Required | Description             | Default |
| -------------------- | -------- | ----------------------- | ------- |
| `ROGERROGER_API_KEY` | Yes      | Your RogerRoger API key | -       |

## Usage

### With Claude Desktop

Once configured, simply chat with Claude and reference your RogerRoger data:

**Examples:**

- "Show me my contacts"
- "Create a new person named Sarah Smith with email sarah@example.com"
- "What tasks do I have assigned?"
- "Update contact ID abc123 with new phone number +1234567890"

### Running Standalone (Advanced)

For development or testing:

```bash
npm start
```

The server will run on stdio and wait for MCP requests.

## Available Tools

### People Management

- **`get_people`**: Retrieve all contacts with optional pagination
- **`get_person`**: Get a specific person by ID
- **`create_person`**: Create a new contact
- **`update_person`**: Update an existing contact
- **`delete_person`**: Delete a contact

### Task Management

- **`get_tasks`**: Retrieve tasks with optional filtering
- **`create_task`**: Create a new task

## API Examples

### Get All People

```typescript
// Returns paginated list of all contacts
await callTool("get_people", {
  limit: 50,
  offset: 0,
});
```

### Create a New Contact

```typescript
await callTool("create_person", {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  company: "Acme Corp",
  notes: "Met at conference",
});
```

### Create a Task

```typescript
await callTool("create_task", {
  title: "Follow up with John",
  description: "Schedule a demo call",
  due_date: "2024-12-31",
  assignee_id: "person_123",
  priority: "high",
});
```

## Development

### Setup

```bash
git clone https://github.com/yourusername/rogerroger-mcp-server.git
cd rogerroger-mcp-server
npm install
```

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test
```

## Project Structure

```
src/
├── index.ts          # Main MCP server implementation
├── types/           # TypeScript type definitions
└── utils/           # Utility functions

dist/                # Compiled JavaScript output
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## API Documentation

This MCP server is built based on the [RogerRoger API documentation](https://developer.rogerroger.io/). As RogerRoger expands their API, we'll add more tools and capabilities.

Currently supported endpoints:

- `GET /people` - List all people
- `GET /people/{id}` - Get person by ID
- `POST /people` - Create new person
- `PUT /people/{id}` - Update person
- `DELETE /people/{id}` - Delete person
- `GET /tasks` - List tasks
- `POST /tasks` - Create task

## Error Handling

The server includes comprehensive error handling for:

- Missing API keys
- Network failures
- Invalid API responses
- Malformed requests

All errors are returned as structured MCP responses with descriptive messages.

## Security Notes

- Never commit your API key to version control
- Use environment variables for sensitive configuration
- The API key is passed securely via headers, never in URLs
- All requests are made over HTTPS

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 🐛 [Report Issues](https://github.com/jpegtel/rogerroger-mcp-server/issues)
- 📖 [RogerRoger API Docs](https://developer.rogerroger.io/)
- 💬 [Model Context Protocol](https://modelcontextprotocol.io/)

## Changelog

### v1.0.0

- Initial release
- Support for people and task management
- Basic CRUD operations
- Comprehensive error handling
