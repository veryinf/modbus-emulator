# Stage 1: Build UI
FROM node:20-alpine AS ui-builder
WORKDIR /app

# Copy UI files
COPY ui/ ./ui/

# Install dependencies and build UI
WORKDIR /app/ui
RUN npm install -g pnpm && pnpm install && pnpm run build

# Stage 2: Build Go application
FROM golang:1.25.3-alpine AS go-builder
WORKDIR /app

# Set environment variables
ENV GO111MODULE=on
ENV CGO_ENABLED=0

# Install git for dependency management
RUN apk add --no-cache git

# Copy go.mod and go.sum to download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy UI build to public directory
COPY --from=ui-builder /app/ui/dist ./public

# Copy source code
COPY . ./

# Build the Go application
RUN go build -o me ./cmd/main.go

# Stage 3: Create a lightweight runtime image
FROM alpine:latest
WORKDIR /app

# Install necessary dependencies
RUN apk add --no-cache ca-certificates

# Copy the built application from the previous stage
COPY --from=go-builder /app/me ./
COPY --from=go-builder /app/public ./public
COPY --from=go-builder /app/devices-config.json ./

# Expose the port the application will run on
EXPOSE 8080

# Run the application
CMD ["./me"]