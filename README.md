# Shoe Shop Application

This is a full-stack e-commerce application for a shoe shop with a React/Next.js frontend and an ASP.NET Core backend with MongoDB.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [.NET SDK](https://dotnet.microsoft.com/download) (v8.0 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (v6.0 or later)

## Setup Instructions

### MongoDB Setup

1. Install MongoDB:
   ```bash
   brew install mongodb-community
   ```

2. Start MongoDB service:
   ```bash
   brew services start mongodb-community
   ```

3. MongoDB will be running at `mongodb://localhost:27017`

### Backend Setup

1. Navigate to the Server directory:
   ```bash
   cd Server
   ```

2. Restore .NET packages:
   ```bash
   dotnet restore
   ```

3. Build the project:
   ```bash
   dotnet build
   ```

4. Run the API:
   ```bash
   cd ShoeShopAPI
   dotnet run
   ```

The API will be available at:
- Swagger UI: `https://localhost:7117/swagger` or `http://localhost:5059/swagger` 
- API Endpoints:
  - GET `/api/products` - Get all products
  - GET `/api/products/{id}` - Get product by ID
  - POST `/api/products` - Create a new product

### Frontend Setup

1. Navigate to the Client directory:
   ```bash
   cd Clientt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

## Project Structure

- `Server/`: ASP.NET Core API with MongoDB integration
  - `ShoeShopAPI/`: API project with products endpoints
    - `Controllers/`: API controllers
    - `Models/`: Data models
    - `Services/`: Business logic and database access
- `Clientt/`: Next.js React frontend application 