#!/bin/bash

# Start the .NET server in the background
echo "Starting .NET server..."
cd Serverr && dotnet run &
SERVER_PID=$!

# Wait a bit for the server to start
sleep 5

# Start the Next.js client
echo "Starting Next.js client..."
cd Clientt && npm run dev

# If the client is stopped, stop the server as well
kill $SERVER_PID 