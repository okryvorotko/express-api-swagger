# How to launch
1. Clone repo
2. Install dependencies with `npm install`
3. Add `.env` file into root directory with content:
```
PORT=8080
BASE_URL=http://localhost
SWAGGER_URL=/api-docs
```
4. Launch API with `node api/base-api.js`

# Specifications
1. This program should imitate the store
2. API should be accessible with url formulated by .env in format: `{BASE_URL}:{PORT}`
3. UI should be accessible with url formulated by .env in format: `{BASE_URL}:{PORT}{SWAGGER_URL}`
4. All APIs should function according to Swagger

# Tasks for QA
1. Write automation tests for UI
2. Write automation tests for API in the same repository

### TODO add bugs