---
layout: page
title: "C++ 学习记录：基础与常见坑"
date: 2026-03-09
---

## 基本习惯

### 头文件与命名空间

测试，超链接，我的仓库位置[bg-notes](https://github.com/baige0930/bg-notes)

- 只 include 用到的头文件，避免“全家桶”。
- 头文件里尽量不写 `using namespace std;`。

### RAII（Resource Acquisition Is Initialization）

- 把资源（内存、文件句柄、锁）绑定到对象生命周期。
- 优先使用 `std::unique_ptr`/`std::shared_ptr` 管理动态资源。

## 容器与引用

### vector 扩容导致引用失效

- `std::vector` 可能扩容迁移内存，导致之前的指针/引用/迭代器失效。
- 做法：需要稳定地址时考虑 `std::deque`，或提前 `reserve()`。

### range-for 的引用写法

- 只读：`for (const auto& x : v)`
- 要改元素：`for (auto& x : v)`

## 小例子

### unique_ptr 管理对象

```cpp
// Example: ownership is unique, auto deleted on scope exit
auto p = std::make_unique<int>(42);
```

### lambda 捕获

- 捕获引用要注意生命周期（不要返回引用到已销毁对象）。

