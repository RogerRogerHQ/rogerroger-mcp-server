# RogerRoger MCP Server

A Model Context Protocol (MCP) server for the [RogerRoger API](https://developer.rogerroger.io/). This server allows AI assistants like Claude to interact with your RogerRoger data through standardized MCP tools.

## Features

- 🧑‍🤝‍🧑 **People Management**: Create, read, update, and delete contacts
- 🏢 **Organization Management**: Create, read, update, and delete organizations
- 📋 **List Management**: Create, read, update, and delete lists/segments for organizing contacts
- 🏷️ **Tag Management**: Create, read, update, and delete tags with customizable colors
- ✅ **Task Management**: Create and retrieve tasks
- 🔐 **Secure Authentication**: Uses API keys for secure access
- 📊 **Pagination Support**: Handle large datasets efficiently

## Setup Instructions

### Basic Setup

1. **Install the package:**

```bash
npm install -g @rogerrogerio/mcp-server
```

2. **Get your RogerRoger API key:**

   - Log in to your RogerRoger account
   - Navigate to [Admin Panel > API](https://app.rogerroger.io/admin/api)
   - Generate or copy your API key

3. **Run the server:**

```bash
npx @rogerrogerio/mcp-server
```

### Claude Desktop Setup

To set up this MCP server in Claude Desktop:

1. **Install the package globally** if you haven't already:

```bash
npm install -g @rogerrogerio/mcp-server
```

2. **Create or edit** the Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the MCP server configuration:

```json
{
  "mcpServers": {
    "rogerroger": {
      "command": "npx",
      "args": ["-y", "@rogerrogerio/mcp-server"],
      "env": {
        "ROGERROGER_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

3. **Restart Claude Desktop** completely (quit and reopen).

4. **Verify the connection** - you should see the RogerRoger MCP server indicator in Claude Desktop.

### Installing from Source

If you prefer to install from source:

```bash
git clone https://github.com/rogerrogerhq/rogerroger-mcp-server.git
cd rogerroger-mcp-server
npm install
npm run build
```

Then update your Claude Desktop configuration to use the local installation:

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
- "List all organizations in our CRM"
- "Create a new organization called Acme Corp"
- "Show me all my lists"
- "Create a new list called 'Hot Leads' with a star icon"
- "Show me all tags"
- "Create a new tag called 'VIP' with a gold background"
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

- **`rogerroger:get_people`**: Retrieve all contacts with optional pagination
- **`rogerroger:get_person`**: Get a specific person by ID
- **`rogerroger:create_person`**: Create a new contact
- **`rogerroger:update_person`**: Update an existing contact
- **`rogerroger:delete_person`**: Delete a contact

### Organization Management

- **`rogerroger:get_organizations`**: Retrieve all organizations with optional pagination
- **`rogerroger:get_organization`**: Get a specific organization by ID
- **`rogerroger:create_organization`**: Create a new organization
- **`rogerroger:update_organization`**: Update an existing organization
- **`rogerroger:delete_organization`**: Delete an organization

### List Management

- **`rogerroger:get_lists`**: Retrieve all lists/segments with optional pagination
- **`rogerroger:get_list`**: Get a specific list by ID
- **`rogerroger:create_list`**: Create a new list/segment
- **`rogerroger:update_list`**: Update an existing list
- **`rogerroger:delete_list`**: Delete a list

### Tag Management

- **`rogerroger:get_tags`**: Retrieve all tags with optional pagination
- **`rogerroger:get_tag`**: Get a specific tag by ID
- **`rogerroger:create_tag`**: Create a new tag with customizable colors
- **`rogerroger:update_tag`**: Update an existing tag
- **`rogerroger:delete_tag`**: Delete a tag

### Task Management

- **`rogerroger:get_tasks`**: Retrieve tasks with optional filtering
- **`rogerroger:create_task`**: Create a new task

## API Examples

### Get All People

```typescript
// Returns paginated list of all contacts
await callTool("rogerroger:get_people", {
  limit: 50,
  offset: 0,
});
```

### Create a New Contact

```typescript
await callTool("rogerroger:create_person", {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  company: "Acme Corp",
  notes: "Met at conference",
});
```

### Create an Organization

```typescript
await callTool("rogerroger:create_organization", {
  name: "Acme Corporation",
  website: "https://acme.com",
  industry: "Technology",
  employees: 500,
  notes: "Potential enterprise client",
});
```

### Create a List

```typescript
await callTool("rogerroger:create_list", {
  title: "Hot Leads",
  icon: "star",
  sequence: 1,
});
```

### Get All Lists

```typescript
// Returns paginated list of all lists/segments
await callTool("rogerroger:get_lists", {
  page: 1,
  itemsPerPage: 15,
});
```

### Create a Tag

```typescript
await callTool("rogerroger:create_tag", {
  title: "VIP Client",
  backgroundColor: "#FFD700",
  textColor: "#000000",
  description: "High-value clients requiring special attention",
});
```

### Get All Tags

```typescript
// Returns paginated list of all tags
await callTool("rogerroger:get_tags", {
  page: 1,
  itemsPerPage: 30,
});
```

### Create a Task

```typescript
await callTool("rogerroger:create_task", {
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
git clone https://github.com/rogerrogerhq/rogerroger-mcp-server.git
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
- `GET /organizations` - List all organizations
- `GET /organizations/{id}` - Get organization by ID
- `POST /organizations` - Create new organization
- `PUT /organizations/{id}` - Update organization
- `DELETE /organizations/{id}` - Delete organization
- `GET /segments` - List all lists/segments
- `GET /segments/{id}` - Get list by ID
- `POST /segments` - Create new list
- `PATCH /segments/{id}` - Update list
- `DELETE /segments/{id}` - Delete list
- `GET /tags` - List all tags
- `GET /tags/{id}` - Get tag by ID
- `POST /tags` - Create new tag
- `PATCH /tags/{id}` - Update tag
- `DELETE /tags/{id}` - Delete tag
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

This server provides access to your sensitive data and should be deployed with appropriate security measures. Consider:

- Keeping your API key secure and never committing it to version control
- Using environment variables for configuration
- Restricting network access where appropriate
- Regularly rotating your API keys

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 🐛 [Report Issues](https://github.com/rogerrogerhq/rogerroger-mcp-server/issues)
- 📖 [RogerRoger API Docs](https://developer.rogerroger.io/)
- 💬 [Model Context Protocol](https://modelcontextprotocol.io/)

## Changelog

### v1.0.2

- Added organizations management endpoints
- Added lists/segments management endpoints
- Added tags management endpoints
- Full CRUD operations for organizations, lists, and tags
- Support for customizable tag colors (backgroundColor, textColor)
- Support for list pagination with page and itemsPerPage parameters
- Updated documentation with examples

### v1.0.1

- Bug fixes and improvements

### v1.0.0

- Initial release
- Support for people and task management
- Basic CRUD operations
- Comprehensive error handling
