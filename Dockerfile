# Multi-stage Dockerfile for Spring Boot services (multi-module aware)
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /build

# Copy entire project (root)
COPY . .

# Build arguments
ARG MODULE
ARG JAR_FILE

# Build entire project with all dependencies (avoids module resolution issues)
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy arguments again (needed in runtime stage)
ARG MODULE
ARG JAR_FILE

# Copy JAR from builder stage
COPY --from=builder /build/${MODULE}/target/${JAR_FILE} app.jar

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
