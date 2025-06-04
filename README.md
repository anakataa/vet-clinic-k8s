# 🐾 Vet Clinic Backend — Kubernetes Deployment

Бэкенд-часть ветеринарной клиники, развернутая с использованием Docker и Kubernetes.

## 📦 Технологии

- Python 3.10
- Django
- REST API
- Docker
- Kubernetes (Minikube)
- Prometheus (Мониторинг)

## 📁 Структура

```
├── backend/                 # Исходный Django-код
├── Dockerfile               # Сборка контейнера
├── requirements.txt         # Зависимости
├── k8s/                     # Kubernetes манифесты
├── .dockerignore
└── README.md
```

## 🚀 Запуск локально в Minikube

### 1. Установка (если ещё не сделано)

```bash
sudo apt install docker.io
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube start --driver=docker
```

### 2. Сборка Docker-образа

```bash
docker build -t vetclinic/backend:latest .
```

### 3. Применение манифестов

```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/prometheus-monitoring.yaml
```

### 4. Доступ

```bash
minikube service vet-backend-service
minikube service prometheus
```

## 🧾 Автор

Проект подготовлен в рамках учебного задания по Kubernetes.
