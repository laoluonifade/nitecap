FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server.py .
COPY gunicorn.conf.py .
COPY outputs ./outputs
ENV PORT=8000 ORDER_DB=/data/orders.sqlite3
EXPOSE 8000
CMD ["sh", "-c", "gunicorn --config gunicorn.conf.py --bind 0.0.0.0:${PORT} --workers 1 --threads 4 --timeout 40 server:app"]
