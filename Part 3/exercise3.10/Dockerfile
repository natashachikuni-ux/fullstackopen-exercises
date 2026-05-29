# Use a tiny 5MB base image instead of a 150MB Ubuntu image
FROM alpine:3.19

WORKDIR /usr/app

# Install curl cleanly without saving temporary setup cache data
RUN apk add --no-cache curl bash

COPY script.sh .

# Ensure the script is explicitly executable
RUN chmod +x script.sh

# 👇 SECURITY HARDENING: Drop root privileges completely
RUN adduser -D appuser && chown -R appuser /usr/app
USER appuser

ENTRYPOINT ["./script.sh"]