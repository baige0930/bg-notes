---
layout: default
title: "神经网络学习记录：从感知机到反向传播"
date: 2026-03-09
---

## 感知机（Perceptron）

### 形式

- 输入：$x \in \mathbb{R}^d$
- 权重：$w \in \mathbb{R}^d$，偏置 $b$
- 输出：$\hat{y} = \mathrm{sign}(w^T x + b)$

## 多层感知机（MLP）

### 为什么需要非线性

- 线性层叠加仍是线性，无法表示 XOR 等非线性可分问题。
- 激活函数（ReLU/sigmoid/tanh）提供非线性表达能力。

## 反向传播（Backprop）

### 核心思想

- 用链式法则把损失函数对每一层参数的梯度分解出来。
- 训练时通常用 mini-batch SGD/Adam 更新参数。

### 训练常见问题

- 梯度消失/爆炸：初始化、归一化、残差结构会有帮助。
- 过拟合：正则化、Dropout、数据增强、早停。

