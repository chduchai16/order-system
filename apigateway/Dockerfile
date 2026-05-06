# Stage 1: Build JAR
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /build
COPY . .
RUN mvn clean package -DskipTests -pl apigateway -am

# Stage 2: Create Custom JRE via jlink
FROM eclipse-temurin:17-jdk-alpine AS jre-builder
RUN $JAVA_HOME/bin/jlink \
    --add-modules java.base,java.sql,java.naming,java.desktop,java.management,java.security.jgss,java.instrument,jdk.unsupported,java.net.http,java.logging,jdk.crypto.ec,java.xml,java.security.sasl \
    --strip-debug \
    --no-man-pages \
    --no-header-files \
    --compress=2 \
    --output /javaruntime

# Stage 3: Final Runtime Image
FROM alpine:latest
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"
COPY --from=jre-builder /javaruntime $JAVA_HOME

WORKDIR /app
COPY --from=builder /build/apigateway/target/apigateway-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-XX:InitialRAMPercentage=50.0", \
    "-XX:MaxMetaspaceSize=128m", \
    "-Xss256k", \
    "-XX:+UseSerialGC", \
    "-Dspring.main.lazy-initialization=true", \
    "-jar", "app.jar"]

