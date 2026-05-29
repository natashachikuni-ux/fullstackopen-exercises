# STAGE 1: Build the application using the heavy Go image
FROM golang:1.16-alpine AS build-stage
WORKDIR /usr/src/app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

# STAGE 2: Copy ONLY the compiled binary into a completely empty 0-byte slate
FROM scratch
WORKDIR /
COPY --from=build-stage /usr/src/app/server /server

# 👇 SECURITY + SIZE UPGRADE: Run as a static non-root user ID inside scratch
USER 10001

ENV PORT=8080
EXPOSE 8080
CMD ["./server"]