#!/bin/bash

while true; do
  nc -zv db 3306 >/dev/null
  if [ "$?" -eq 0 ]; then
    echo CONNECTION SUCCESSFUL
    npx prisma db push --skip-generate
    break
  else
    echo CONNECTION FAILED - RETRYING...
    sleep 2
  fi
done

HOSTNAME="0.0.0.0" node server.js
