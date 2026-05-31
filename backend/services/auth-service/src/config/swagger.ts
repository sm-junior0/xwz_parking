export const authSwaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "XWZ Auth Service",
    version: "1.0.0",
    description: "Authentication and user management endpoints",
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
      SignupRequest: {
        type: "object",
        required: ["firstName", "lastName", "email", "password", "role"],
        properties: {
          firstName: { type: "string", example: "Jane" },
          lastName: { type: "string", example: "Doe" },
          email: { type: "string", format: "email", example: "jane@xwz.com" },
          password: { type: "string", example: "StrongPass123!" },
          role: { type: "string", enum: ["admin", "parking_attendant"], example: "parking_attendant" },
        },
      },
      VerifyOtpRequest: {
        type: "object",
        required: ["email", "otpCode"],
        properties: {
          email: { type: "string", format: "email", example: "jane@xwz.com" },
          otpCode: { type: "string", example: "123456" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@xwz.com" },
          password: { type: "string", example: "Admin123!" },
        },
      },
      AuthUser: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["admin", "parking_attendant"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      AuthSuccessResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Login successful" },
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          user: { $ref: "#/components/schemas/AuthUser" },
        },
      },
      SignupOtpResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "OTP generated successfully. Verify the OTP to complete signup." },
          email: { type: "string", format: "email" },
          expiresAt: { type: "string", format: "date-time" },
          otpPreview: { type: "string", example: "123456" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Validation failed" },
          errorType: { type: "string", example: "AppError" },
          detail: { type: "string", example: "Detailed error message in development mode" },
        },
      },
    },
  },
  paths: {
    "/api/auth/signup": {
      post: {
        summary: "Start signup and generate OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignupRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "OTP generated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SignupOtpResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/signup/verify-otp": {
      post: {
        summary: "Verify OTP and complete signup",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VerifyOtpRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Signup completed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthSuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Authenticate a user and return JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthSuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/users": {
      get: {
        summary: "List users with pagination",
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: "query", name: "page", schema: { type: "integer", example: 1 } },
          { in: "query", name: "limit", schema: { type: "integer", example: 10 } },
        ],
        responses: {
          "200": { description: "Users retrieved successfully" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        summary: "Return current user profile",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthUser" },
              },
            },
          },
        },
      },
    },
  },
};
