---
layout: page
title: "计算机组成原理学习记录：指令、流水线与存储层次"
date: 2026-03-09
---

## 指令执行的基本流程

### 经典五阶段（示意）

- IF：取指（Instruction Fetch）
- ID：译码/读寄存器（Instruction Decode）
- EX：执行/地址计算（Execute）
- MEM：访存（Memory）
- WB：回写（Write Back）

## 流水线（Pipeline）

### 冒险（Hazards）

- 结构冒险：硬件资源冲突
- 数据冒险：RAW/WAR/WAW
- 控制冒险：分支跳转导致取指不确定

### 常见缓解

- 转发（Forwarding）
- 插入气泡（Stall）
- 分支预测（Branch Prediction）

## 存储层次结构

### 为什么需要 Cache

- CPU 很快，内存很慢；利用时间/空间局部性提升平均访问速度。

### 关键概念

- 命中率（hit rate）、缺失惩罚（miss penalty）
- 直接映射/组相联/全相联（映射方式）

