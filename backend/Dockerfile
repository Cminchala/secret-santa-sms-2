FROM python:3.13-slim

WORKDIR /app

# Install system dependencies if required
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy project definition and install dependencies
COPY pyproject.toml ./
RUN pip install --no-cache-dir .

# Copy application code
COPY backend/ ./backend/

WORKDIR /app/backend

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
