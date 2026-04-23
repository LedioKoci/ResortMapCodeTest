#!/bin/bash
# Default arguments
MAP_PATH="../map.ascii"
BOOKINGS_PATH="../bookings.json"

# Parse arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --map) MAP_PATH="$2"; shift ;;
        --bookings) BOOKINGS_PATH="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

echo "Starting Backend with --map $MAP_PATH and --bookings $BOOKINGS_PATH"
cd backend
npm install
node index.js --map "$MAP_PATH" --bookings "$BOOKINGS_PATH" &

echo "Starting Frontend..."
cd ../frontend
npm install
npm start &

# Wait for both processes
wait