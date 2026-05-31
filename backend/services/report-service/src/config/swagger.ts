export const reportSwaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "XWZ Report Service",
    version: "1.0.0",
    description: "Reporting endpoints for entered cars, outgoing cars, and revenue",
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/api/reports/entered-cars": {
      get: {
        summary: "Get entered cars between two date times",
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: "query", name: "startDateTime", required: true, schema: { type: "string", format: "date-time", example: "2026-05-01T00:00:00.000Z" } },
          { in: "query", name: "endDateTime", required: true, schema: { type: "string", format: "date-time", example: "2026-05-31T23:59:59.000Z" } },
          { in: "query", name: "page", schema: { type: "integer", example: 1 } },
          { in: "query", name: "limit", schema: { type: "integer", example: 10 } },
        ],
        responses: {
          "200": { description: "Entered cars report retrieved" },
        },
      },
    },
    "/api/reports/outgoing-cars": {
      get: {
        summary: "Get outgoing cars between two date times",
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: "query", name: "startDateTime", required: true, schema: { type: "string", format: "date-time", example: "2026-05-01T00:00:00.000Z" } },
          { in: "query", name: "endDateTime", required: true, schema: { type: "string", format: "date-time", example: "2026-05-31T23:59:59.000Z" } },
          { in: "query", name: "page", schema: { type: "integer", example: 1 } },
          { in: "query", name: "limit", schema: { type: "integer", example: 10 } },
        ],
        responses: {
          "200": { description: "Outgoing cars report retrieved" },
        },
      },
    },
    "/api/reports/revenue": {
      get: {
        summary: "Get total billed amount between two date times",
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: "query", name: "startDateTime", required: true, schema: { type: "string", format: "date-time", example: "2026-05-01T00:00:00.000Z" } },
          { in: "query", name: "endDateTime", required: true, schema: { type: "string", format: "date-time", example: "2026-05-31T23:59:59.000Z" } },
          { in: "query", name: "page", schema: { type: "integer", example: 1 } },
          { in: "query", name: "limit", schema: { type: "integer", example: 10 } },
        ],
        responses: {
          "200": { description: "Revenue report retrieved" },
        },
      },
    },
  },
};
