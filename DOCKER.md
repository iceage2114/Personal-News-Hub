# Docker Setup Guide

This project includes Docker configuration for easy deployment and development.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)

## Quick Start

### 1. Configure Environment Variables

Copy the example environment file and add your configuration:

```bash
cp .env.example .env
```

Edit `.env` and add your DeepSeek API key:

```env
DEEPSEEK_API_KEY=your_actual_api_key_here
```

### 2. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

The services will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 3. Stop Services

```bash
# Stop services (keeps containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers, volumes, and images
docker-compose down --volumes --rmi all
```

## Individual Service Commands

### Build Specific Service

```bash
# Build backend only
docker-compose build backend

# Build frontend only
docker-compose build frontend
```

### Run Specific Service

```bash
# Run backend only
docker-compose up backend

# Run frontend only (will also start backend due to dependency)
docker-compose up frontend
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Development vs Production

### Development

For development with hot-reload, consider mounting volumes in `docker-compose.yml`:

```yaml
services:
  backend:
    volumes:
      - ./backend:/app
  frontend:
    volumes:
      - ./newsapp:/app
      - /app/node_modules
```

### Production

For production deployment:

1. Use environment-specific `.env` files
2. Consider using Docker secrets for sensitive data
3. Set up reverse proxy (nginx) for HTTPS
4. Configure proper logging and monitoring

## Building Individual Docker Images

### Backend

```bash
cd backend
docker build -t newsapp-backend:latest .
docker run -p 8000:8000 --env-file ../.env newsapp-backend:latest
```

### Frontend

```bash
cd newsapp
docker build -t newsapp-frontend:latest .
docker run -p 3000:3000 newsapp-frontend:latest
```

## Troubleshooting

### Port Already in Use

If ports 3000 or 8000 are already in use, modify the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change host port (left side)
```

### Container Won't Start

Check logs for errors:
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Clean Rebuild

Remove all containers, volumes, and rebuild:
```bash
docker-compose down --volumes
docker-compose build --no-cache
docker-compose up
```

### Permission Issues (Linux/Mac)

If you encounter permission issues:
```bash
sudo docker-compose up
# or
sudo chown -R $USER:$USER .
```

## Health Checks

The backend includes a health check endpoint at `/health` which Docker uses to verify the service is running correctly.

## Networking

All services run in a custom Docker network (`newsapp-network`) allowing them to communicate with each other using service names.
