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
      version: "1.0.3",
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
                page: {
                  type: "number",
                  description: "Collection page number (default: 1)",
                },
                itemsPerPage: {
                  type: "number",
                  description: "Items per page, max 30 (default: 15)",
                },
                q: {
                  type: "string",
                  description: "Search query to filter people by name, email, or other fields",
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
                page: {
                  type: "number",
                  description: "Collection page number (default: 1)",
                },
                itemsPerPage: {
                  type: "number",
                  description: "Items per page, max 30 (default: 15)",
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
          {
            name: "get_organizations",
            description: "Retrieve all organizations from RogerRoger CRM",
            inputSchema: {
              type: "object",
              properties: {
                page: {
                  type: "number",
                  description: "Collection page number (default: 1)",
                },
                itemsPerPage: {
                  type: "number",
                  description: "Items per page, max 30 (default: 15)",
                },
                q: {
                  type: "string",
                  description: "Search query to filter organizations by name or other fields",
                },
              },
            },
          },
          {
            name: "get_organization",
            description: "Retrieve a specific organization by ID",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "The ID of the organization to retrieve",
                },
              },
              required: ["id"],
            },
          },
          {
            name: "create_organization",
            description: "Create a new organization in RogerRoger",
            inputSchema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Organization name",
                },
                website: {
                  type: "string",
                  description: "Organization website",
                },
                industry: {
                  type: "string",
                  description: "Industry type",
                },
                employees: {
                  type: "number",
                  description: "Number of employees",
                },
                notes: {
                  type: "string",
                  description: "Additional notes",
                },
              },
            },
          },
          {
            name: "update_organization",
            description: "Update an existing organization",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "The ID of the organization to update",
                },
                name: {
                  type: "string",
                  description: "Organization name",
                },
                website: {
                  type: "string",
                  description: "Organization website",
                },
                industry: {
                  type: "string",
                  description: "Industry type",
                },
                employees: {
                  type: "number",
                  description: "Number of employees",
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
            name: "delete_organization",
            description: "Delete an organization",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "The ID of the organization to delete",
                },
              },
              required: ["id"],
            },
          },
          {
            name: "get_lists",
            description: "Retrieve all lists/segments from RogerRoger",
            inputSchema: {
              type: "object",
              properties: {
                page: {
                  type: "number",
                  description: "Collection page number (default: 1)",
                },
                itemsPerPage: {
                  type: "number",
                  description: "Items per page, max 30 (default: 15)",
                },
              },
            },
          },
          {
            name: "get_list",
            description: "Retrieve a specific list/segment by ID",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "The ID of the list to retrieve",
                },
              },
              required: ["id"],
            },
          },
          {
            name: "create_list",
            description: "Create a new list/segment in RogerRoger",
            inputSchema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Name of the list",
                },
                icon: {
                  type: "string",
                  description: "Icon identifier for the list",
                },
                sequence: {
                  type: "number",
                  description: "Order sequence (optional)",
                },
              },
              required: ["title", "icon"],
            },
          },
          {
            name: "update_list",
            description: "Update an existing list/segment",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "The ID of the list to update",
                },
                title: {
                  type: "string",
                  description: "Name of the list",
                },
                icon: {
                  type: "string",
                  description: "Icon identifier for the list",
                },
                sequence: {
                  type: "number",
                  description: "Order sequence (optional)",
                },
              },
              required: ["id", "title", "icon"],
            },
          },
          {
            name: "delete_list",
            description: "Delete a list/segment",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "The ID of the list to delete",
                },
              },
              required: ["id"],
            },
          },
          {
            name: "get_tags",
            description: "Retrieve all tags from RogerRoger",
            inputSchema: {
              type: "object",
              properties: {
                page: {
                  type: "number",
                  description: "Collection page number (default: 1)",
                },
                itemsPerPage: {
                  type: "number",
                  description: "Items per page, max 30 (default: 15)",
                },
              },
            },
          },
          {
            name: "get_tag",
            description: "Retrieve a specific tag by ID",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "The ID of the tag to retrieve",
                },
              },
              required: ["id"],
            },
          },
          {
            name: "create_tag",
            description: "Create a new tag in RogerRoger",
            inputSchema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Tag name",
                },
                backgroundColor: {
                  type: "string",
                  description: "Label background color (optional)",
                },
                textColor: {
                  type: "string",
                  description: "Label text color (optional)",
                },
                description: {
                  type: "string",
                  description: "Tag description (optional)",
                },
              },
              required: ["title"],
            },
          },
          {
            name: "update_tag",
            description: "Update an existing tag",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "The ID of the tag to update",
                },
                title: {
                  type: "string",
                  description: "Tag name",
                },
                backgroundColor: {
                  type: "string",
                  description: "Label background color (optional)",
                },
                textColor: {
                  type: "string",
                  description: "Label text color (optional)",
                },
                description: {
                  type: "string",
                  description: "Tag description (optional)",
                },
              },
              required: ["id", "title"],
            },
          },
          {
            name: "delete_tag",
            description: "Delete a tag",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "The ID of the tag to delete",
                },
              },
              required: ["id"],
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
          case "get_organizations":
            return await this.getOrganizations(args || {});
          case "get_organization":
            if (!args || typeof args !== "object" || !("id" in args)) {
              throw new Error("Missing required parameter: id");
            }
            return await this.getOrganization(String(args.id));
          case "create_organization":
            return await this.createOrganization(args || {});
          case "update_organization":
            if (!args || typeof args !== "object" || !("id" in args)) {
              throw new Error("Missing required parameter: id");
            }
            return await this.updateOrganization(String(args.id), args);
          case "delete_organization":
            if (!args || typeof args !== "object" || !("id" in args)) {
              throw new Error("Missing required parameter: id");
            }
            return await this.deleteOrganization(String(args.id));
          case "get_lists":
            return await this.getLists(args || {});
          case "get_list":
            if (!args || typeof args !== "object" || !("id" in args)) {
              throw new Error("Missing required parameter: id");
            }
            return await this.getList(String(args.id));
          case "create_list":
            return await this.createList(args || {});
          case "update_list":
            if (!args || typeof args !== "object" || !("id" in args)) {
              throw new Error("Missing required parameter: id");
            }
            return await this.updateList(String(args.id), args);
          case "delete_list":
            if (!args || typeof args !== "object" || !("id" in args)) {
              throw new Error("Missing required parameter: id");
            }
            return await this.deleteList(String(args.id));
          case "get_tags":
            return await this.getTags(args || {});
          case "get_tag":
            if (!args || typeof args !== "object" || !("id" in args)) {
              throw new Error("Missing required parameter: id");
            }
            return await this.getTag(String(args.id));
          case "create_tag":
            return await this.createTag(args || {});
          case "update_tag":
            if (!args || typeof args !== "object" || !("id" in args)) {
              throw new Error("Missing required parameter: id");
            }
            return await this.updateTag(String(args.id), args);
          case "delete_tag":
            if (!args || typeof args !== "object" || !("id" in args)) {
              throw new Error("Missing required parameter: id");
            }
            return await this.deleteTag(String(args.id));
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
    if (args.page) params.page = args.page.toString();
    if (args.itemsPerPage) params.itemsPerPage = args.itemsPerPage.toString();
    if (args.q) params.q = args.q;

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
    if (args.page) params.page = args.page.toString();
    if (args.itemsPerPage) params.itemsPerPage = args.itemsPerPage.toString();
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

  private async getOrganizations(args: any) {
    const params: Record<string, string> = {};
    if (args.page) params.page = args.page.toString();
    if (args.itemsPerPage) params.itemsPerPage = args.itemsPerPage.toString();
    if (args.q) params.q = args.q;

    const data = await this.makeRequest("/organizations", { params });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getOrganization(id: string) {
    const data = await this.makeRequest(`/organizations/${id}`);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async createOrganization(args: any) {
    const data = await this.makeRequest("/organizations", {
      method: "POST",
      body: args,
    });

    return {
      content: [
        {
          type: "text",
          text: `Organization created successfully: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  private async updateOrganization(id: string, args: any) {
    const { id: _, ...updateData } = args;
    const data = await this.makeRequest(`/organizations/${id}`, {
      method: "PUT",
      body: updateData,
    });

    return {
      content: [
        {
          type: "text",
          text: `Organization updated successfully: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  private async deleteOrganization(id: string) {
    await this.makeRequest(`/organizations/${id}`, {
      method: "DELETE",
    });

    return {
      content: [
        {
          type: "text",
          text: `Organization with ID ${id} deleted successfully`,
        },
      ],
    };
  }

  private async getLists(args: any) {
    const params: Record<string, string> = {};
    if (args.page) params.page = args.page.toString();
    if (args.itemsPerPage) params.itemsPerPage = args.itemsPerPage.toString();

    const data = await this.makeRequest("/segments", { params });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getList(id: string) {
    const data = await this.makeRequest(`/segments/${id}`);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async createList(args: any) {
    const data = await this.makeRequest("/segments", {
      method: "POST",
      body: args,
    });

    return {
      content: [
        {
          type: "text",
          text: `List created successfully: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  private async updateList(id: string, args: any) {
    const { id: _, ...updateData } = args;
    const data = await this.makeRequest(`/segments/${id}`, {
      method: "PATCH",
      body: updateData,
    });

    return {
      content: [
        {
          type: "text",
          text: `List updated successfully: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  private async deleteList(id: string) {
    await this.makeRequest(`/segments/${id}`, {
      method: "DELETE",
    });

    return {
      content: [
        {
          type: "text",
          text: `List with ID ${id} deleted successfully`,
        },
      ],
    };
  }

  private async getTags(args: any) {
    const params: Record<string, string> = {};
    if (args.page) params.page = args.page.toString();
    if (args.itemsPerPage) params.itemsPerPage = args.itemsPerPage.toString();

    const data = await this.makeRequest("/tags", { params });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getTag(id: string) {
    const data = await this.makeRequest(`/tags/${id}`);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async createTag(args: any) {
    const data = await this.makeRequest("/tags", {
      method: "POST",
      body: args,
    });

    return {
      content: [
        {
          type: "text",
          text: `Tag created successfully: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  private async updateTag(id: string, args: any) {
    const { id: _, ...updateData } = args;
    const data = await this.makeRequest(`/tags/${id}`, {
      method: "PATCH",
      body: updateData,
    });

    return {
      content: [
        {
          type: "text",
          text: `Tag updated successfully: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  private async deleteTag(id: string) {
    await this.makeRequest(`/tags/${id}`, {
      method: "DELETE",
    });

    return {
      content: [
        {
          type: "text",
          text: `Tag with ID ${id} deleted successfully`,
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
