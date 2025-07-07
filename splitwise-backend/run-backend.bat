@echo off
set DATABASE_URL=postgresql://splitwise:splitwise123@localhost:9357/splitwisedb
set JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
set PORT=8080
set HOST=127.0.0.1

echo Starting Splitwise Backend...
echo Database URL: %DATABASE_URL%
echo Port: %PORT%
echo Host: %HOST%

cargo run 