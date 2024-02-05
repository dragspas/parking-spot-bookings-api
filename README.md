# Parking Spot Bookings API

Node.js/Express.js/Postgres test, API for parking spot bookings

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

### Get a list of bookings (paginated limit/offset, role restricted)

```
curl --location 'localhost:3000/api/bookings?limit=10' \
--header 'Token: 1|admin'
```

### Create booking

```
curl --location 'localhost:3000/api/bookings' \
--header 'Token: 1|admin' \
--header 'Content-Type: application/json' \
--data '{
    "start_date_time": "2024-02-06 11:00",
    "end_date_time": "2024-02-06 12:00",
    "parking_spot_id": 1
}'
```

### Update booking (parking spot and time)

```
curl --location --request PATCH 'localhost:3000/api/bookings/10' \
--header 'Token: 1|admin' \
--header 'Content-Type: application/json' \
--data '{
    "parking_spot_id": 5
}'
```

### Delete booking

```
curl --location --request DELETE 'localhost:3000/api/bookings/1' \
--header 'Token: 1|admin'
```

## Comments

- Search for `@note` in the project to find some improvements suggestions, ideas and clarifications
