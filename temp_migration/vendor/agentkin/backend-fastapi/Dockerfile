FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
# gcc and python3-dev might be needed for some packages like psutil
RUN apt-get update && apt-get install -y gcc python3-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Upgrade pip and install requirements
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port (Rocket by default, or 8000)
# Railway provides PORT env var
ENV PORT=8000
EXPOSE $PORT

# Command to run the application
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"
