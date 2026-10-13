# Multi-stage build for Spring Boot Backend on Railway / Docker
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copy Maven wrapper & pom.xml from campusos-backend
COPY campusos-backend/mvnw .
COPY campusos-backend/.mvn .mvn
COPY campusos-backend/pom.xml .

RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

# Copy backend source code and compile
COPY campusos-backend/src src
RUN ./mvnw clean package -DskipTests

# Runtime stage with lightweight JRE
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

RUN groupadd -r spring && useradd -r -g spring spring

COPY --from=build /app/target/*.jar app.jar

USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
