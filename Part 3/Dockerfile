# Use the official Docker image as our base
FROM docker:24-cli

# Install Git, Bash, and a tool to fix Windows line-endings
RUN apk add --no-cache git bash dos2unix

# Set the working directory
WORKDIR /app

# Copy your script into the container
COPY builder.sh .

# Fix Windows invisible carriage returns (\r) and make it executable
RUN dos2unix builder.sh && chmod +x builder.sh

# Tell the container to run our script automatically when it starts
ENTRYPOINT ["bash", "/app/builder.sh"]