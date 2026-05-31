export const parkingSwaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "XWZ Parking Service",
    version: "1.0.0",
    description: "Parking registration and availability endpoints",
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
      ParkingRequest: {
        type: "object",
        required: ["code", "parkingName", "availableSpaces", "location", "chargingFeePerHour"],
        properties: {
          code: { type: "string", example: "KGL-01" },
          parkingName: { type: "string", example: "Kigali City Center" },
          availableSpaces: { type: "integer", example: 25 },
          location: { type: "string", example: "Kigali Downtown" },
          chargingFeePerHour: { type: "number", example: 5 },
        },
      },
      Parking: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          code: { type: "string" },
          parkingName: { type: "string" },
          availableSpaces: { type: "integer" },
          totalSpaces: { type: "integer" },
          location: { type: "string" },
          chargingFeePerHour: { type: "number" },
        },
      },
    },
  },
  paths: {
    "/api/parkings": {
      post: {
        summary: "Create a parking area",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ParkingRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Parking created" },
        },
      },
      get: {
        summary: "List parking areas with pagination",
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: "query", name: "page", schema: { type: "integer", example: 1 } },
          { in: "query", name: "limit", schema: { type: "integer", example: 10 } },
          { in: "query", name: "search", schema: { type: "string", example: "KGL" } },
        ],
        responses: {
          "200": { description: "Parking list retrieved" },
        },
      },
    },
    "/api/parkings/{code}": {
      get: {
        summary: "Get one parking area by code",
        security: [{ BearerAuth: [] }],
        parameters: [{ in: "path", name: "code", required: true, schema: { type: "string", example: "KGL-01" } }],
        responses: {
          "200": {
            description: "Parking found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Parking" },
              },
            },
          },
        },
      },
    },
  },
};
