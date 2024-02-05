# parking-spot-bookings-api

Node.js/Express.js/Postgres test, API for parking spot bookings

# Get Started

## Prerequisites

- Docker installed on your machine

## Run app with Docker

```
docker-compose up
```

## Endpoints

### Check app health

```
curl --location 'localhost:3000/health'

```

### Get list of bookings (paginated limit/offset, role restricted)

```
curl --location 'localhost:3000/api/bookings?limit=10' \
--header 'Token: 1|admin'
```

### Create booking

```

```

### Update booking (parking spot and time)

```

```

### Delete booking

```
curl --location --request DELETE 'localhost:3000/api/bookings/1'
```
