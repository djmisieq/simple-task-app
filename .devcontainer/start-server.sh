#!/bin/bash

echo "Uruchamianie serwera dla Task App na porcie 8080..."
cd /workspaces/simple-task-app
http-server -p 8080
