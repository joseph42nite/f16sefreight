# 🚀 IT & DEVOPS PRODUCTION ROLLOUT MANIFESTO

This document separates operational procedures into two distinct delivery modules for precision targeting.

---

# ⚙️ PART 1: ASYNCHRONOUS OCR INFRASTRUCTURE SETUP
Deploy these steps to establish the High-Availability Python microservice and Redis pipeline.

### 1. Server Software Prerequisites
Ensure your production Linux server has Redis and Supervisor installed.
```bash
sudo apt update
sudo apt install redis-server supervisor -y
sudo systemctl enable redis-server.service
sudo systemctl start redis-server.service
```

### 2. Setup Dedicated Python Environment
Set up isolation and install FastAPI modules inside the existing `/python` directory:
```bash
cd python
python3 -m venv venv
./venv/bin/pip install fastapi uvicorn pdfplumber python-multipart
```

### 3. Environment Configuration (.env)
Append the following keys to your production `.env` file:
```dotenv
# Switched from 'sync' to 'redis'
QUEUE_CONNECTION=redis

# Fast API Endpoint Target
OCR_SERVICE_URL=http://127.0.0.1:8001

# Redis Client Config
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_CLIENT=predis
```

### 4. Supervisor Configurations (Process Lifelines)
**Command A: Instantiate FastAPI microservice daemon**
```bash
cat << 'EOF' | sudo tee /etc/supervisor/conf.d/f16s-ocr-fastapi.conf
[program:f16s-ocr-fastapi]
command=/var/www/f16s_main/python/venv/bin/uvicorn ocr_server:app --host 127.0.0.1 --port 8001 --workers 2
directory=/var/www/f16s_main/python
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/f16s_main/storage/logs/fastapi.log
stopwaitsecs=10
EOF
```

**Command B: Instantiate Laravel Background Worker cluster**
```bash
cat << 'EOF' | sudo tee /etc/supervisor/conf.d/f16s-pdf-worker.conf
[program:f16s-pdf-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/f16s_main/artisan queue:work redis --queue=pdf_processing --tries=3 --timeout=15 --sleep=1 --max-jobs=500
autostart=true
autorestart=true
user=www-data
numprocs=3
redirect_stderr=true
stdout_logfile=/var/www/f16s_main/storage/logs/worker.log
stopwaitsecs=20
EOF
```
*(💡 Note: Adjust `/var/www/f16s_main` to match physical app path).*

### 5. Activate Daemons & Validate
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start f16s-ocr-fastapi:*
sudo supervisorctl start f16s-pdf-worker:*

# Validate Connectivity
curl http://127.0.0.1:8001/health
```

---

# 📊 PART 2: COORDINATE GOVERNANCE ENGINE (THE PORTAL)
Deploy these steps to fully instantiate the Database-First Template management screens.

### 1. Database Migration (Apply Relational Updates)
Realize the template configurations table and deploy required repair schema updates to user profiles:
```bash
php artisan migrate
```

### 2. Critical Data Bootstrap
Perform this **ONE-TIME** runtime execution to copy existing configuration JSON state seamlessly into the newly built database table:
```bash
php artisan tinker --execute="\$path = base_path('python/boxes_config.json'); if (file_exists(\$path)) { \$data = json_decode(file_get_contents(\$path), true); if (isset(\$data['templates'])) { foreach (\$data['templates'] as \$k => \$v) { \App\SystemTemplate::updateOrCreate(['key' => \$k], ['coordinates' => \$v]); echo \"Imported \$k\n\"; } } }"
```

### 3. Application Cache Flush
Wipe the internal Laravel cache to bind available-templates routing logic to the updated DB cache Pluck system:
```bash
php artisan optimize:clear
```

### 4. Recompile Frontend Assets
Force re-aggregation of Javascript modules to push the updated coordinate building interfaces to users:
```bash
npm install
npm run prod
```
