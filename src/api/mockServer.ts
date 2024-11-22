// src/api/mockServer.ts
import { createServer, Model, Response } from "miragejs";

export function setupMockServer() {
  createServer({
    models: {
      user: Model,
      role: Model,
    },

    seeds(server) {
      server.create("user", { id: "1", name: "Admin", role: "Admin", status: "Active" });
      server.create("user", { id: "2", name: "User", role: "Editor", status: "Inactive" });
      server.create("role", { id: "3", name: "Admin", permissions: ["read", "write", "delete"] });
      server.create("role", { id: "4", name: "Editor", permissions: ["read", "write"] });
      console.log("Seeded Users:", server.db.users);
      console.log("Seeded Roles:", server.db.roles);
    },

    routes() {
      this.namespace = "api";

      // Users Routes
      this.get("/users", (schema) => {
        const users = schema.all("user");
        console.log("GET /users called. Response:", users.models);
        return { users: users.models };
      });

      this.post("/users", (schema, request) => {
        const data = JSON.parse(request.requestBody);
        if (!data.name || !data.role || !data.status) {
          return new Response(400, {}, { error: "Missing required fields" });
        }
        const id = String(Math.random()); // Generate unique ID
        const user = schema.create("user", { id, ...data });
        console.log("POST /users called. Created User:", user.attrs);
        return new Response(201, {}, user.attrs);
      });

      this.put("/users/:id", (schema, request) => {
        const id = request.params.id;
        const data = JSON.parse(request.requestBody);
        const user = schema.find("user", id);

        if (!user) {
          return new Response(404, {}, { error: `User with ID ${id} not found` });
        }

        user.update(data);
        console.log("PUT /users/:id called. Updated User:", user.attrs);
        return new Response(200, {}, user.attrs);
      });

      this.del("/users/:id", (schema, request) => {
        const user = schema.find("user", request.params.id);
        if (!user) {
          return new Response(404, {}, { error: `User with ID ${request.params.id} not found` });
        }

        user.destroy();
        console.log(`DELETE /users/:id called. Deleted User with ID ${request.params.id}`);
        return new Response(204);
      });

      // Roles Routes
      this.get("/roles", (schema) => {
        const roles = schema.all("role");
        console.log("GET /roles called. Response:", roles.models);
        return { roles: roles.models };
      });

      this.post("/roles", (schema, request) => {
        const data = JSON.parse(request.requestBody);
        if (!data.name || !Array.isArray(data.permissions) || data.permissions.length === 0) {
          return new Response(400, {}, { error: "Invalid role data or missing permissions" });
        }
        const id = String(Math.random()); // Generate unique ID
        const role = schema.create("role", { id, ...data });
        console.log("POST /roles called. Created Role:", role.attrs);
        return new Response(201, {}, role.attrs);
      });

      this.put("/roles/:id", (schema, request) => {
        const id = request.params.id;
        const data = JSON.parse(request.requestBody);
        const role = schema.find("role", id);

        if (!role) {
          return new Response(404, {}, { error: `Role with ID ${id} not found` });
        }

        role.update(data);
        console.log("PUT /roles/:id called. Updated Role:", role.attrs);
        return new Response(200, {}, role.attrs);
      });

      this.del("/roles/:id", (schema, request) => {
        const role = schema.find("role", request.params.id);
        if (!role) {
          return new Response(404, {}, { error: `Role with ID ${request.params.id} not found` });
        }

        role.destroy();
        console.log(`DELETE /roles/:id called. Deleted Role with ID ${request.params.id}`);
        return new Response(204);
      });

      // Permissions Routes
      this.get("/roles/:id/permissions", (schema, request) => {
        const role = schema.find("role", request.params.id);

        if (!role) {
          return new Response(404, {}, { error: `Role with ID ${request.params.id} not found` });
        }

        console.log(`GET /roles/:id/permissions called. Permissions for Role ID ${request.params.id}:`, (role.attrs as { permissions: string[] }).permissions);
        return { permissions: (role.attrs as { permissions: string[] }).permissions };
      });

      this.put("/roles/:id/permissions", (schema, request) => {
        const role = schema.find("role", request.params.id);

        if (!role) {
          return new Response(404, {}, { error: `Role with ID ${request.params.id} not found` });
        }

        const data = JSON.parse(request.requestBody);
        if (!Array.isArray(data.permissions)) {
          return new Response(400, {}, { error: "Invalid permissions data" });
        }

        role.update({ permissions: data.permissions });
        console.log(`PUT /roles/:id/permissions called. Updated Permissions for Role ID ${request.params.id}:`, role.attrs);
        return new Response(200, {}, role.attrs);
      });
    },
  });
}
