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
Write automation tests for API(adding or editing item scenarios) in the same repository

### Bugs
1. POST and PATCH accept an item name as alphanum where documentation says it is string
2. POST and PATCH accept an item name max 15 symbols where documentation says that there is only min limit
