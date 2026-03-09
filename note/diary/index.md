---
layout: index
title: "日记"
expand: none
---

这里按时间汇总每天的日常记录。

## 样式测试

这是一段普通正文。包含 `inline code` 和 **加粗**、*斜体*、~~删除线~~ 以及 [一个链接](#)。

> 这是一段引用文字（blockquote）。引用内容通常来自他处，Cayman 默认显示为灰色左边框样式。

---

## 代码测试

单行行内代码：使用 `git commit -m "message"` 提交更改。

多行代码块（C++）：

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int x : v) {
        sum += x;
    }
    std::cout << "sum = " << sum << std::endl;
    return 0;
}
```

多行代码块（Python）：

```python
import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

x = np.linspace(-5, 5, 100)
y = sigmoid(x)
print(f"sigmoid(0) = {sigmoid(0):.4f}")
```

多行代码块（Shell）：

```bash
#!/bin/bash
for file in *.md; do
    echo "Processing: $file"
    wc -l "$file"
done
```

---

## 公式测试

行内公式：欧拉公式 $e^{i\pi} + 1 = 0$，二次方程的根为 $x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$。

独立公式块——正态分布的概率密度函数：

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} \exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)
$$

矩阵乘法：

$$
\begin{pmatrix} a & b \\ c & d \end{pmatrix}
\begin{pmatrix} x \\ y \end{pmatrix}
=
\begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}
$$

梯度下降更新规则：

$$
\theta_{t+1} = \theta_t - \eta \nabla_\theta \mathcal{L}(\theta_t)
$$

---

## 表格测试

| 方法 | 时间复杂度 | 空间复杂度 | 稳定性 |
|------|-----------|-----------|--------|
| 冒泡排序 | $O(n^2)$ | $O(1)$ | 稳定 |
| 快速排序 | $O(n \log n)$ | $O(\log n)$ | 不稳定 |
| 归并排序 | $O(n \log n)$ | $O(n)$ | 稳定 |
| 堆排序   | $O(n \log n)$ | $O(1)$ | 不稳定 |
