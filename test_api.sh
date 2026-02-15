#!/bin/bash

# Base URL
URL="http://localhost:3000/users"

echo "--- GET All Users ---"
curl -s $URL | json_pp
echo ""

echo "--- GET User with ID 1 ---"
curl -s $URL/1 | json_pp
echo ""

echo "--- POST Create New User ---"
curl -s -X POST -H "Content-Type: application/json" -d '{"name": "Alice", "email": "alice@example.com"}' $URL | json_pp
echo ""

echo "--- PUT Update User with ID 1 ---"
curl -s -X PUT -H "Content-Type: application/json" -d '{"name": "John Updated", "email": "john_new@example.com"}' $URL/1 | json_pp
echo ""

echo "--- DELETE User with ID 2 ---"
curl -s -X DELETE $URL/2
echo "Deleted user 2"
echo ""

echo "--- GET All Users After Operations ---"
curl -s $URL | json_pp
echo ""
