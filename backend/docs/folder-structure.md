# Backend Folder Structure

```
backend/
  database/
    schema.sql
  docs/
  services/
    api-gateway/
    auth-service/
    parking-service/
    car-service/
    report-service/
  shared/
    constants/
    middleware/
    types/
    utils/
```

Each microservice includes:

- `config`: environment, database, and Swagger setup
- `controllers`: thin request handlers
- `middleware`: request validation and service-specific guards
- `models`: Sequelize models
- `routes`: REST endpoint definitions
- `services`: business logic
- `utils`: local helpers
