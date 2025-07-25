# Backend Setup

This backend uses dotenv to manage environment variables.

## Environment Variables Setup

1. Create a `.env` file in the backend directory:
```bash
touch .env
```

2. Add the following environment variables to your `.env` file:
```env
# LlamaIndex API Configuration
LLAMA_API_KEY=your_actual_llama_api_key_here

# Server Configuration
PORT=3000
```

## Available Environment Variables

- `LLAMA_API_KEY`: Your LlamaIndex API key (required)
- `PORT`: Server port (defaults to 3000 if not set)

## Running the Server

```bash
npm start
```

The server will automatically load environment variables from the `.env` file using dotenv. 