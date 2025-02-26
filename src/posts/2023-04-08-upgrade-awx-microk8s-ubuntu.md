---
publishDate: 2023-04-08
title: Upgrade AWX with MicroK8s cluster on Ubuntu Server
excerpt: Step by step instructions to upgrade AWX with MicroK8s cluster on Ubuntu Server, using Helm chart.
image: ~/assets/images/awx-large.png
category: Tutorial
tags: [Linux, AWX, Ansible, Kubernetes, Helm, MicroK8s]
---

## 1. Prerequisites

- Set up MicroK8S cluster: <https://bgx4k3p.github.io/blog/kubernetes-microk8s-ubuntu>
- Install AWX: <https://bgx4k3p.github.io/blog/linux-awx-microk8s-ubuntu>

## 2. Pull the Latest Helm chart

- Find the latest version of AWX: <https://github.com/ansible/awx>
- Find the latest version of AWX Operator: <https://github.com/ansible/awx-operator/releases>
- Find the latest version of Helm chart:<https://artifacthub.io/packages/helm/awx-operator/awx-operator>

```bash
# Update helm repos
ansible@kube:~$ microk8s helm repo update

Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "awx-operator" chart repository
Update Complete. ⎈Happy Helming!⎈

# Check current installed version
ansible@kube:~$ microk8s helm list -A

NAME NAMESPACE REVISION UPDATED                                 STATUS   CHART              APP VERSION
awx  awx       1        2023-04-04 01:50:49.715016633 +0000 UTC deployed awx-operator-1.4.0 1.4.0

# Check latest version in repo
ansible@kube:~$ microk8s helm search repo awx-operator

NAME                      CHART VERSION APP VERSION DESCRIPTION
awx-operator/awx-operator 2.0.0         2.0.0       A Helm chart for the AWX Operator
```

## 3. Upgrade AWX Operator

Helm charts make the install and upgrade very easy.

```bash
# Switch to the AWX namespace
ansible@kube:~$ kubectl config set-context --current --namespace=awx

# Upgrade with Helm
ansible@kube:~$ microk8s helm upgrade -n awx --create-namespace awx awx-operator/awx-operator

Release "awx" has been upgraded. Happy Helming!
NAME: awx
LAST DEPLOYED: Sat Apr  8 14:06:05 2023
NAMESPACE: awx
STATUS: deployed
REVISION: 2
TEST SUITE: None
NOTES:
AWX Operator installed with Helm Chart version 2.0.0

# Check installed version
ansible@kube:~$ microk8s helm list -A

NAME NAMESPACE REVISION UPDATED                                 STATUS   CHART              APP VERSION
awx  awx       2        2023-04-08 14:06:05.528617359 +0000 UTC deployed awx-operator-2.0.0 2.0.0
```

## 4. Check AWX

AWX Operator will upgrade AWX Tower automatically. It is important to have enough CPU and Memory for the upgrade to work. Recommended 16Gb RAM and 6 CPU cores. The AWX data will be migrate automatically and the old pods will be terminated. Check the version under Help-About and it should show the latest.

```bash
ansible@kube:~$ kubectl get pods -n awx

NAME                                               READY   STATUS    RESTARTS   AGE
awx-postgres-13-0                                  1/1     Running   0          5d13h
awx-operator-controller-manager-77c67f9445-p65nq   2/2     Running   0          4m2s
awx-task-674967f876-njq2m                          4/4     Running   0          2m44s
awx-web-6bb95678b6-d2wmh                           3/3     Running   0          2m18s
```

Optional: Open another terminal to monitor the install live

```bash
ansible@kube:~$ kubectl logs -f deployments/awx-operator-controller-manager -c awx-manager
```
