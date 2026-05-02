# CI/CD Pipeline Configuration

This directory contains GitHub Actions workflows that automate the build, test, and deployment processes for the Order System microservices.

## Workflows Overview

### 1. **CI Pipeline** (`ci.yml`)
Triggered on push to `main`/`develop` and pull requests.
- **Build Java Services**: Compiles all Maven modules, runs unit and integration tests
- **Build Frontend**: Installs dependencies, runs linter, builds Next.js frontend
- **Code Quality**: Checks code formatting
- **Build Docker Images**: Builds and pushes Docker images for all services to GitHub Container Registry
- Uploads test reports and artifacts

### 2. **CD Pipeline** (`cd.yml`)
Handles continuous deployment to staging and production.
- **Deploy to Staging**: Runs on every push to `main` branch
- **Deploy to Production**: Runs on version tags (`v*`)
- Creates release notes automatically

### 3. **Security Scanning** (`security.yml`)
Comprehensive security checks scheduled weekly and on every push.
- **Dependency Check**: OWASP dependency vulnerability scanning
- **Java Security Scan**: Maven-based security checks
- **Frontend Security**: npm audit for JavaScript dependencies
- **Container Scanning**: Trivy vulnerability scanner for Docker images
- Results uploaded to GitHub Security tab

### 4. **Performance Testing** (`performance.yml`)
Performance and load testing workflows.
- **Performance Tests**: Runs on every push/PR
- **Load Testing**: Manual trigger for intensive load testing
- Tests against local PostgreSQL and Kafka services
- Comments results on pull requests

### 5. **Cleanup** (`cleanup.yml`)
Scheduled maintenance to clean up old artifacts.
- Deletes artifacts older than 30 days weekly
- Cleans up container images

## Trigger Conditions

| Workflow | Trigger | Branch |
|----------|---------|--------|
| CI | Push, PR | main, develop |
| CD - Staging | Push | main |
| CD - Production | Tag push | - |
| Security | Push, PR, Weekly | main, develop |
| Performance | Push, PR, Manual | main, develop |
| Cleanup | Weekly, Manual | - |

## Environment Setup

### Prerequisites
- GitHub repository with Actions enabled
- Docker Hub or GitHub Container Registry account
- Kubernetes cluster or Docker Swarm for deployments (optional)

### Secrets Configuration
Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

```bash
# For container registry (optional if using GitHub Container Registry)
REGISTRY_USERNAME=<your-username>
REGISTRY_PASSWORD=<your-password>
REGISTRY_URL=<registry-url>

# For deployments
KUBE_CONFIG=<base64-encoded-kubernetes-config>
STAGING_DEPLOY_URL=<staging-deployment-url>
PROD_DEPLOY_URL=<production-deployment-url>
```

## Build Artifacts

### Generated Artifacts
- **Java Test Reports**: `**/target/surefire-reports/`
- **Frontend Build**: `frontend/.next/`
- **Docker Images**: `ghcr.io/<owner>/<repo>/<service>:branch-<commit-sha>`
- **Security Reports**: `target/dependency-check-report.json`

### Artifact Retention
- Default retention: 90 days
- Cleanup job: Deletes artifacts older than 30 days weekly

## Services Built

### Java Services
- apigateway
- authservice
- userservice
- productservice
- orderservice
- paymentservice
- notificationservice
- discoveryserver

### Frontend
- Next.js React application

## Deployment Instructions

### Manual Deployment Steps

1. **Modify CD Workflow** (`cd.yml`)
   
   For **Kubernetes** deployment:
   ```yaml
   - name: Deploy to Production
     run: |
       kubectl apply -f k8s/production/ --context=prod-cluster
       kubectl rollout status deployment/<service-name> -n order-system
   ```

   For **Docker Swarm**:
   ```yaml
   - name: Deploy to Production
     run: |
       docker stack update order-system --compose-file docker-compose.yml
   ```

2. **Set Deployment Credentials**
   - Add `KUBE_CONFIG` secret for Kubernetes
   - Or configure Docker credentials for Swarm

3. **Update Docker Compose**
   - Update `docker-compose.yml` with correct image tags
   - Example: `image: ghcr.io/owner/repo/orderservice:main-abc123`

## Testing

### Running Locally
```bash
# Build all services
mvn clean package

# Run tests
mvn test

# Test frontend
cd frontend
npm install
npm run lint
npm run build
```

### GitHub Actions CI
All tests run automatically on push and PR.

## Monitoring and Logs

1. **View Workflow Runs**
   - GitHub repository → Actions tab
   - Click on workflow run for details

2. **Check Logs**
   - Click on job name
   - View step logs in real-time

3. **Artifacts**
   - After workflow completion → Artifacts section
   - Download test reports and build outputs

## Troubleshooting

### Build Failures

1. **Maven Build Failed**
   ```bash
   # Check logs for compilation errors
   # Common causes: Java version mismatch, dependency issues
   ```

2. **Docker Build Failed**
   ```bash
   # Verify Dockerfile exists and is executable
   ls -la <service>/Dockerfile
   ```

3. **Frontend Build Failed**
   ```bash
   # Check npm dependencies
   cd frontend && npm install --legacy-peer-deps
   ```

### Deployment Issues

1. **Image Not Found**
   - Verify Docker build completed successfully
   - Check image exists in registry: `docker pull ghcr.io/owner/repo/service:tag`

2. **Kubernetes Deployment Failed**
   - Check kubeconfig is correctly base64 encoded
   - Verify cluster context and namespace

## Best Practices

1. ✅ Always create pull requests for feature development
2. ✅ Review CI results before merging
3. ✅ Keep security scan results clean
4. ✅ Monitor performance test trends
5. ✅ Use semantic versioning for releases (v1.0.0)
6. ✅ Write meaningful commit messages for traceability

## Performance Optimization

### Build Cache
- Workflows use Docker layer caching via `cache-from: type=gha`
- Maven cache managed automatically with `actions/setup-java@v4`
- Node.js cache via `package-lock.json`

### Parallel Execution
- Java and Frontend builds run in parallel
- Docker images built in parallel via matrix strategy
- Test jobs run concurrently

## Integration with Other Tools

### JUnit Reports
Test results automatically uploaded to GitHub Actions summary page.

### Code Coverage
Add Codecov integration by adding to CI workflow:
```yaml
- uses: codecov/codecov-action@v3
  with:
    files: ./target/site/jacoco/jacoco.xml
```

### Slack Notifications
Add workflow status notifications:
```yaml
- uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Future Enhancements

- [ ] Add code coverage reporting
- [ ] Implement SonarQube integration
- [ ] Add E2E testing with Playwright/Cypress
- [ ] Implement canary deployment strategy
- [ ] Add blue-green deployment support
- [ ] Configure auto-scaling triggers based on performance tests
