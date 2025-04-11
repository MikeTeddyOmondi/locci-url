# Default
default:
  just --list

# Run dev mode
run-dev:
  cargo watch -q -c -w ./src -x run  

# Build Docker Image
build-image:
  docker build -t ranckosolutionsinc/locci-url-api:v1.0.0 . 

# Run Docker Container
run-container:
  docker run -d -p 3000:3000 \
  --restart always \
  -e DATABASE_URL=${DATABASE_URL} \
  -e DATABASE_AUTH_TOKEN=${DATABASE_AUTH_TOKEN} \
  -e BASE_URL=${BASE_URL} \
  --name locci-url-api \
  ranckosolutionsinc/locci-url-api:v1.0.0 

# Docker compose 
compose:
  docker-compose up -d

# Docker compose down
compose-down:
  docker-compose down

push: 
  docker push ranckosolutionsinc/locci-url-api:v1.0.0 