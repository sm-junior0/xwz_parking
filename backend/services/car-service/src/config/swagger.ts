export const carSwaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "XWZ Car Service",
    version: "1.0.0",
    description: "Car entries, exits, tickets, and bills",
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      CarFlowRequest: {
        type: "object",
        required: ["plateNumber", "parkingCode"],
        properties: {
          plateNumber: { type: "string", example: "RAB123A" },
          parkingCode: { type: "string", example: "KGL-01" },
        },
      },
    },
  },
  paths: {
    "/api/cars/entries": {
      post: {
        summary: "Register a car entry and generate ticket",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CarFlowRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Entry registered successfully" },
        },
      },
      get: {
        summary: "List car entries with pagination",
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: "query", name: "page", schema: { type: "integer", example: 1 } },
          { in: "query", name: "limit", schema: { type: "integer", example: 10 } },
          { in: "query", name: "status", schema: { type: "string", example: "IN" } },
          { in: "query", name: "plateNumber", schema: { type: "string", example: "RAB" } },
        ],
        responses: {
          "200": { description: "Entries retrieved successfully" },
        },
      },
    },
    "/api/cars/exits": {
      post: {
        summary: "Register a car exit and generate bill",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CarFlowRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Exit registered successfully" },
        },
      },
    },
    "/api/cars/tickets": {
      get: {
        summary: "List tickets with pagination",
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: "query", name: "page", schema: { type: "integer", example: 1 } },
          { in: "query", name: "limit", schema: { type: "integer", example: 10 } },
        ],
        responses: {
          "200": { description: "Tickets retrieved successfully" },
        },
      },
    },
    "/api/cars/bills": {
      get: {
        summary: "List bills with pagination",
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: "query", name: "page", schema: { type: "integer", example: 1 } },
          { in: "query", name: "limit", schema: { type: "integer", example: 10 } },
        ],
        responses: {
          "200": { description: "Bills retrieved successfully" },
        },
      },
    },
  },
};
