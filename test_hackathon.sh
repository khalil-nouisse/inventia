#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@inventia.local","password":"password"}' | jq -r .data.accessToken)

echo "Got Token: $TOKEN"

curl -s -X POST http://localhost:8080/api/hackathons \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Hackathon Test",
    "description": "Test Description",
    "theme": "AI",
    "prize": "$1000",
    "registrationDeadline": "2026-07-01",
    "startDate": "2026-07-10",
    "endDate": "2026-07-15",
    "maxTeamSize": 5
  }' | jq .
