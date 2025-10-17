#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

interface RogerRogerConfig {
  apiKey: string;
  baseUrl?: string;
}

class RogerRogerMCP {
  private config: RogerRogerConfig;
  private server: Server;

  constructor() {
    this.config = {
      apiKey: process.env.ROGERROGER_API_KEY || "",
      baseUrl: process.env.ROGERROGER_BASE_URL || "https://api.rogerroger.io",
    };

    this.server = new Server({
      name: "rogerroger-mcp",
      version: "1.0.0",
    });

    this.setupTools();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupTools(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get_people",
            description: "Retrieve all people/contacts from RogerRoger CRM",
            inputSchema: {
              type: "object",
              properties: {
                limit: {
                  type: "number",
                  description: "Number of records to retrieve (optional)",
                },
                offset: {
                  type: "number",
                  description: "Offset for pagination (optional)",
                },
              },
            },
          },
          {
            name: "get_person",
            description: "Retrieve a specific person by ID",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "The ID of the person to retrieve",
                },
              },
              required: ["id"],
            },
          },
          {
            name: "create_person",
            description: "Create a new person/contact in RogerRoger",
            inputSchema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Full name of the person",
                },
                email: {
                  type: "string",
                  description: "Email address",
                },
                phone: {
                  type: "string",
                  description: "Phone number",
                },
                company: {
                  type: "string",
                  description: "Company name",
                },
                notes: {
                  type: "string",
                  description: "Additional notes",
                },
              },
            },
          },
          {
            name: "update_person",
            description: "Update an existing person/contact",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "The ID of the person to update",
                },
                name: {
                  type: "string",
                  description: "Full name of the person",
                },
                email: {
                  type: "string",
                  description: "Email address",
                },
                phone: {
                  type: "string",
                  description: "Phone number",
                },
                company: {
                  type: "string",
                  description: "Company name",
                },
                notes: {
                  type: "string",
                  description: "Additional notes",
                },
              },
              required: ["id"],
            },
          },
          {
            name: "delete_person",
            description: "Delete a person/contact",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "The ID of the person to delete",
                },
              },
              required: ["id"],
            },
          },
          {
            name: "get_tasks",
            description: "Retrieve tasks from RogerRoger",
            inputSchema: {
              type: "object",
              properties: {
                limit: {
                  type: "number",
                  description: "Number of records to retrieve (optional)",
                },
                offset: {
                  type: "number",
                  description: "Offset for pagination (optional)",
                },
                status: {
                  type: "string",
                  description: "Filter by task status (optional)",
                },
              },
            },
          },
          {
            name: "create_task",
            description: "Create a new task in RogerRoger",
            inputSchema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Task title",
                },
                description: {
                  type: "string",
                  description: "Task description",
                },
                due_date: {
                  type: "string",
                  description: "Due date (ISO format)",
                },
                assignee_id: {
                  type: "string",
                  description: "ID of person to assign task to",
                },
                priority: {
                  type: "string",
                  description: "Task priority (low, medium, high)",
                },
              },
              required: ["title"],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "get_people":
            return await this.getPeople(args || {});
          case "get_person":
            if (!args || typeof args !== "object" || !("id" in args)) {
              throw new Error("Missing required parameter: id");
            }
            return await this.getPerson(String(args.id));
          case "create_person":
            return await this.createPerson(args || {});
          case "update_person":
            if (!args || typeof args !== "object" || !("id" in args)) {
              throw new Error("Missing required parameter: id");
            }
            return await this.updatePerson(String(args.id), args);
          case "delete_person":
            if (!args || typeof args !== "object" || !("id" in args)) {
              throw new Error("Missing required parameter: id");
            }
            return await this.deletePerson(String(args.id));
          case "get_tasks":
            return await this.getTasks(args || {});
          case "create_task":
            return await this.createTask(args || {});
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
        };
      }
    });
  }

  private async makeRequest(
    endpoint: string,
    options: {
      method?: string;
      body?: any;
      params?: Record<string, string>;
    } = {}
  ): Promise<any> {
    if (!this.config.apiKey) {
      throw new Error("ROGERROGER_API_KEY environment variable is required");
    }

    const { method = "GET", body, params } = options;
    let url = `${this.config.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const headers: Record<string, string> = {
      "X-API-KEY": this.config.apiKey,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  }

  private async getPeople(args: any) {
    const params: Record<string, string> = {};
    if (args.limit) params.limit = args.limit.toString();
    if (args.offset) params.offset = args.offset.toString();

    const data = await this.makeRequest("/people", { params });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getPerson(id: string) {
    const data = await this.makeRequest(`/people/${id}`);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async createPerson(args: any) {
    const data = await this.makeRequest("/people", {
      method: "POST",
      body: args,
    });

    return {
      content: [
        {
          type: "text",
          text: `Person created successfully: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  private async updatePerson(id: string, args: any) {
    const { id: _, ...updateData } = args;
    const data = await this.makeRequest(`/people/${id}`, {
      method: "PUT",
      body: updateData,
    });

    return {
      content: [
        {
          type: "text",
          text: `Person updated successfully: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  private async deletePerson(id: string) {
    await this.makeRequest(`/people/${id}`, {
      method: "DELETE",
    });

    return {
      content: [
        {
          type: "text",
          text: `Person with ID ${id} deleted successfully`,
        },
      ],
    };
  }

  private async getTasks(args: any) {
    const params: Record<string, string> = {};
    if (args.limit) params.limit = args.limit.toString();
    if (args.offset) params.offset = args.offset.toString();
    if (args.status) params.status = args.status;

    const data = await this.makeRequest("/tasks", { params });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async createTask(args: any) {
    const data = await this.makeRequest("/tasks", {
      method: "POST",
      body: args,
    });

    return {
      content: [
        {
          type: "text",
          text: `Task created successfully: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new RogerRogerMCP();
server.run().catch(console.error);
