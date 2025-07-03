#  Vet Clinic Backend — Kubernetes Deployment

This is the backend of a veterinary clinic project, containerized using Docker and deployed with Kubernetes. It includes monitoring using Prometheus and Grafana, and supports CI/CD via GitHub Actions.

---

## 📦 Technologies Used


- Backend: Django + Django REST Framework
- Containerization: Docker
- Orchestration: Kubernetes (Minikube)
- CI/CD: GitHub Actions
- Monitoring: Prometheus, Grafana
- GitHub Actions (CI/CD)

---

---

## 📁 Project Structure

vet-clinic-k8s/
├── backend/                   
├── Dockerfile                 
├── requirements.txt          
├── k8s/                       
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── prometheus.yaml        
│   └── grafana.yaml           
├── .github/                   
│   └── workflows/cicd.yaml
├── .dockerignore
└── README.md

---
---

##  How to Run the Project Locally (Minikube)

### 1. Install Dependencies (Ubuntu/Debian/Linux)

```bash
sudo apt update

sudo apt install docker.io -y

curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

sudo install minikube-linux-amd64 /usr/local/bin/minikube

minikube start --driver=docker
```
### 2. Build the Docker Image
```bash
docker build -t vetclinic/backend:latest
```
This will build your Django backend into a Docker image.

### 3. Apply Kubernetes Manifests
Apply all configuration files to the cluster:
```bash

kubectl apply -f k8s/

kubectl apply -f k8s/configmap.yaml

kubectl apply -f k8s/secret.yaml

kubectl apply -f k8s/backend-deployment.yaml

kubectl apply -f k8s/backend-service.yaml

kubectl apply -f k8s/prometheus-monitoring.yaml

kubectl apply -f k8s/grafana.yaml
```
### 4. Verify Pods & Services

```bash
kubectl get pods

kubectl get svc
```
### 5. Verify Pods & Services
Backend (Django API)
```bash
kubectl port-forward svc/vet-backend-service 8000:8000
# Access at http://localhost:8000
```
Prometheus
```bash
kubectl port-forward svc/prometheus 9090:9090
# Access at http://localhost:9090
```
Grafana
```bash
kubectl port-forward svc/grafana 3000:3000
# Access at http://localhost:3000
```

## ⚙️ CI/CD with GitHub Actions
On push to main:

- Builds Docker image vetclinic/backend
- Pushes to DockerHub
- Deploys manifests to Kubernetes cluster via kubectl

Repository Secrets (in Settings → Secrets):

- DOCKERHUB_USERNAME

- DOCKERHUB_TOKEN

- KUBECONFIG (base64 kubeconfig)

## 📊 Monitoring and Dashboards
Prometheus collects cluster and application metrics.

Grafana connects to Prometheus and shows dashboards.

Anonymous access is enabled for easy testing.

You can import community dashboards or create your own.

## 🧾 Documentation & Troubleshooting
Logs:
```bash
kubectl logs <pod-name>
```
Rolling Restart:
```bash
kubectl rollout restart deployment <deployment-name>
```

## 🧾 Author
This project was developed as part of a Kubernetes training course.
It demonstrates containerization, orchestration, monitoring, and CI/CD automation.
