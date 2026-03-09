---
layout: default
title: "计算机网络学习记录：TCP/IP 基础"
date: 2026-03-09
---

## 分层模型

### TCP/IP（常用理解）

- 应用层：HTTP/DNS/SSH ...
- 传输层：TCP/UDP
- 网络层：IP/ICMP
- 链路层：以太网/Wi-Fi

## TCP

### 连接建立（三次握手）

- 客户端 SYN
- 服务端 SYN+ACK
- 客户端 ACK

### 连接断开（四次挥手）

- FIN/ACK 分开发送是为了支持半关闭（half-close）

## 可靠性与性能

### 重传机制（概念）

- 超时重传（RTO）
- 快速重传（基于重复 ACK）

### 拥塞控制（概念）

- 慢启动（slow start）
- 拥塞避免（congestion avoidance）
- 快重传/快恢复

