# 📚 Library gRPC & HTTP Gateway

[![Node.js](https://img.shields.io/badge/Node.js-v20.19.4-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![gRPC](https://img.shields.io/badge/gRPC-enabled-brightgreen)](https://grpc.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 🚀 Project Description

**Library gRPC & HTTP Gateway** is a modern backend project that implements a gRPC service for managing books in a library and an HTTP gateway for easy API access via REST.  

This project demonstrates:

- Building a **TypeScript gRPC server**.
- Exposing gRPC services through an **Express HTTP gateway**.
- Generating TypeScript types from `.proto` files using **ts-proto**.
- Testing gRPC services with Postman without writing a client.

---

## 📦 Features

- Create, Read, Update, Delete (CRUD) operations for books.
- Pagination support in listing books.
- Fully typed with TypeScript.
- Easily extendable for other gRPC services.
- Postman-ready HTTP endpoints via gateway.

---

## 🏗️ Tech Stack

- **Node.js** v20.x
- **TypeScript** v5.x
- **gRPC** via `@grpc/grpc-js`
- **HTTP Gateway** via `Express.js`
- **Protocol Buffers** for message definitions
- **ts-proto** for TypeScript code generation
- **Postman** for testing endpoints

---

## 📁 Project Structure



library_grpc/
├─ packages/
│ ├─ server/ # gRPC server
│ │ ├─ src/
│ │ │ ├─ proto/ # .proto files
│ │ │ ├─ server.ts
│ │ │ └─ generate.ts
│ ├─ gateway/ # HTTP gateway
│ │ ├─ src/
│ │ │ └─ index.ts
│ │ └─ package.json
└─ README.md



---

## ⚡ Setup & Installation

1. **Clone the repo**

```bash
git clone <your-repo-url>
cd library_grpc/packages/server


2. **Install dependencies for server**

npm install


3. **Generate TypeScript gRPC files**

npx ts-node generate.ts

4. **Run gRPC server**

npx ts-node src/server.ts


5. **Run HTTP Gateway in another terminal**
cd ../gateway
npm install
npm run dev


🔗 HTTP Gateway Endpoints (Postman-ready)

| Method | Endpoint     | Description                |
| ------ | ------------ | -------------------------- |
| POST   | `/books`     | Create a new book          |
| GET    | `/books/:id` | Get a book by ID           |
| PUT    | `/books/:id` | Update a book              |
| DELETE | `/books/:id` | Delete a book              |
| GET    | `/books`     | List books with pagination |

🛠️ Usage

Open Postman.

Use the gateway endpoints to interact with the gRPC server.

All requests are fully typed with TypeScript for easy extension.



⚖️ License

This project is licensed under the MIT License.

