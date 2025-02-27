---
publishDate: 2023-10-27
title: 'Launch Your Automation Hub: Install AWX on Ubuntu with MicroK8s'
excerpt: 'Unlock Ansible automation with AWX!  This step-by-step guide shows you how to install AWX Tower on Ubuntu Server using MicroK8s and Helm for powerful, free automation.' #AWX #Ansible #Kubernetes #Automation #DevOps
image: ~/assets/images/awx-large.png
category: Tutorial
tags: [Linux, AWX, Ansible, Kubernetes, Helm, MicroK8s, Automation, DevOps, IaC]
---

## Launch Your Automation Hub: Install AWX on Ubuntu with MicroK8s - The Ultimate Guide

Ready to take your Ansible automation to the next level? Enter AWX (the upstream project for Red Hat Ansible Automation Platform, formerly Ansible Tower) – the open-source powerhouse that transforms your Ansible playbooks into a centralized, manageable, and collaborative automation platform.

Think of AWX as the **mission control center for your Ansible playbooks**. Instead of managing individual playbooks scattered across your infrastructure, AWX provides a beautiful dashboard to organize, schedule, monitor, and control your automation workflows. And the best part? You can build your own AWX tower for **free**!

In this step-by-step tutorial, we'll guide you through installing AWX on Ubuntu Server using a lightweight Kubernetes cluster powered by MicroK8s and the Helm package manager. Get ready to unlock the full potential of Ansible automation!

## 1. Pre-Flight Checklist: System Prerequisites

Before we launch into AWX installation, ensure your Ubuntu Server meets these essential prerequisites:

- **Ubuntu Server with MicroK8s Cluster:** You'll need a running Ubuntu Server with MicroK8s already configured. If you haven't set this up yet, follow our comprehensive guide: [Kubernetes with MicroK8s on Ubuntu Server](https://bgx4k3p.github.io/blog/posts/kubernetes-microk8s-ubuntu/). This is your launchpad for AWX!
- **Resource Requirements: 6GB+ RAM & 4+ CPUs:** AWX is a robust platform and requires adequate resources to run smoothly. **Seriously, don't skimp on the resources!** Insufficient RAM or CPU will lead to installation failures and a frustrating experience. Think of it like building a rocket – you need enough fuel for a successful launch.

## 2. Enable Kubernetes Add-ons: Fueling the AWX Engine

MicroK8s makes it incredibly easy to enable necessary Kubernetes components with simple commands. We need to enable DNS, Hostpath-storage, Ingress, RBAC (Role-Based Access Control), and Helm add-ons for AWX to function correctly.

Run this single command to enable all required add-ons:

```bash
microk8s enable dns hostpath-storage ingress rbac helm
```
