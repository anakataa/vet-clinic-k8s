#  Vet Clinic Backend — Kubernetes Deployment

This is the backend of a veterinary clinic project, containerized using Docker and deployed with Kubernetes. It includes monitoring using Prometheus and Grafana, and supports CI/CD via GitHub Actions.

---

## 📦 Technologies Used

- Python 3.10
- Django
- Django REST Framework
- Docker
- Kubernetes (via Minikube)
- Prometheus (monitoring)
- Grafana (dashboard visualization)
- GitHub Actions (CI/CD)

---

---

## 📁 Project Structure

vet-clinic-k8s/
├── backend/ # Django source code

├── Dockerfile # Docker image for Django app

├── requirements.txt # Python dependencies

├── k8s/ # Kubernetes manifests

│ ├── backend-deployment.yaml

│ ├── backend-service.yaml

│ ├── configmap.yaml

│ ├── secret.yaml

│ ├── prometheus-monitoring.yaml

│ └── grafana.yaml

├── .github/

│ └── workflows/

│ └── cicd.yaml # GitHub Actions CI/CD pipeline

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
kubectl apply -f k8s/configmap.yaml

kubectl apply -f k8s/secret.yaml

kubectl apply -f k8s/backend-deployment.yaml

kubectl apply -f k8s/backend-service.yaml

kubectl apply -f k8s/prometheus-monitoring.yaml

kubectl apply -f k8s/grafana.yaml
```
### 4. Access the Services
Open your backend and monitoring dashboards in the browser:
```bash
minikube service vet-backend-service

minikube service prometheus

minikube service grafana
```
By default:

Backend runs on port 8000

Prometheus on port 9090

Grafana on port 3000

## ⚙️ GitHub Actions CI/CD
This project includes a CI/CD pipeline using GitHub Actions:

Builds Docker image on every push to main

Pushes to DockerHub

Deploys to Kubernetes automatically

## 🔐 Required Repository Secrets
Set these in your repository settings under:
Settings → Secrets and variables → Actions

| Secret Name         | Description                          |
|---------------------|--------------------------------------|
| `DOCKERHUB_USERNAME` | Your DockerHub username             |
| `DOCKERHUB_TOKEN`    | DockerHub access token              |
| `KUBECONFIG`         | Base64 or raw content of kubeconfig |


## 📊 Monitoring and Dashboards
Prometheus collects cluster and application metrics.

Grafana connects to Prometheus and shows dashboards.

Anonymous access is enabled for easy testing.

You can import community dashboards or create your own.

## 🧾 Author
This project was developed as part of a Kubernetes training course.
It demonstrates containerization, orchestration, monitoring, and CI/CD automation.
