# =========================================================================
# Stage 1: Build the Application
# =========================================================================
FROM eclipse-temurin:25-jdk AS builder

WORKDIR /app

# Install Maven in builder stage for reliable, wrapper-free compilation
RUN apt-get update && apt-get install -y --no-install-recommends maven && rm -rf /var/lib/apt/lists/*

# Copy POM and download dependencies for layer caching
COPY pom.xml ./
RUN mvn dependency:go-offline -B || true

# Copy project source code
COPY src ./src

# Build production executable JAR (skipping test suite during container build)
RUN mvn clean package -DskipTests

# =========================================================================
# Stage 2: Minimal Production Runtime
# =========================================================================
FROM eclipse-temurin:25-jre

WORKDIR /app

# Create a secure, non-root system user and group
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

# Copy compiled JAR artifact from builder stage
COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

# Render automatically injects the PORT environment variable
ENV PORT=8080
EXPOSE 8080

# Run Spring Boot binding dynamically to Render's $PORT with graceful shutdown support
ENTRYPOINT ["sh", "-c", "exec java -Dserver.port=${PORT:-8080} -jar app.jar"]
