# Friend API Spec

## Send friend request

Endpoint : POST /api/friends

Headers :

- Authorization: token

Request Body :

```json
{
  "friendId": 1
}
```

Response Body (Success) :

```json
{
  "data": {
    "userId": 1,
    "friendId": 2,
    "username": "rendi",
    "status": "PENDING"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "friendId not found"
}
```

## Friend Request

Endpoint : PUT /api/friends/:userId

Headers :

- Authorization: token

Request Body :

```json
{
  "status": "ACCEPTED"
}
```

Response Body (Success) :

```json
{
  "data": {
    "userId": 1,
    "friendId": 2,
    "username friend ": "babe",
    "status": "ACCEPTED"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "UserId not found"
}
```

## Get Friends request

Endpoint : GET /api/friends/current

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": [
    {
      "userId": 1,
      "status": "PENDING"
    },
    {
      "userId": 2,
      "status": "ACCEPTED"
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Logout User

Endpoint : DELETE /api/friends/:userId

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": {
    "userId": 2,
    "status": "BLOCKED"
  }
}
```
