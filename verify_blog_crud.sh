#!/bin/bash

BASE_URL="http://localhost:3000"

echo "--- 1. Testing Home Route ---"
curl -s $BASE_URL/
echo -e "\n"

echo "--- 2. Creating a Blog ---"
BLOG_JSON='{"title": "My First Blog", "content": "Hello MongoDB!", "author": "Antigravity"}'
CREATE_RES=$(curl -s -X POST -H "Content-Type: application/json" -d "$BLOG_JSON" $BASE_URL/blogs)
echo $CREATE_RES
BLOG_ID=$(echo $CREATE_RES | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Created Blog ID: $BLOG_ID"
echo -e "\n"

echo "--- 3. Getting All Blogs ---"
curl -s $BASE_URL/blogs
echo -e "\n"

echo "--- 4. Getting Single Blog ---"
curl -s $BASE_URL/blogs/$BLOG_ID
echo -e "\n"

echo "--- 5. Updating Blog ---"
UPDATE_JSON='{"title": "Updated Blog Title", "content": "Updated content", "author": "Antigravity AI"}'
curl -s -X PUT -H "Content-Type: application/json" -d "$UPDATE_JSON" $BASE_URL/blogs/$BLOG_ID
echo -e "\n"

echo "--- 6. Deleting Blog ---"
curl -s -X DELETE $BASE_URL/blogs/$BLOG_ID
echo -e "\n"

echo "--- 7. Verifying Deletion ---"
curl -s $BASE_URL/blogs/$BLOG_ID
echo -e "\n"
