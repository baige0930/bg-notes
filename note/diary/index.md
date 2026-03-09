---
layout: index
title: "日记"
expand: none
---

这里按时间汇总每天的日常记录。

## 样式测试

这是一段普通正文。包含 `inline code` 和 **加粗**、*斜体*、~~删除线~~ 以及 [一个链接](#)。

**加粗（Bold）：** 使用 `**文字**` 语法，适合强调关键词。例：**注意事项**、**重要结论**。

*斜体（Italic）：* 使用 `*文字*` 语法，常用于术语或书名。例：*机器学习*、*The C++ Programming Language*。

***加粗斜体：*** 使用 `***文字***` 同时加粗和倾斜。例：***这非常重要！***

~~删除线（Strikethrough）：~~ 使用 `~~文字~~` 表示删除或过时内容。例：~~旧方案~~、~~已废弃的 API~~。

<u>下划线（Underline）：</u> Markdown 不原生支持下划线，需使用 HTML `<u>` 标签。例：<u>需要特别注意的内容</u>。

<mark>高亮（Highlight）：</mark> 同样需要 HTML `<mark>` 标签。例：<mark>这段文字被高亮显示</mark>，用于标记重点。

混合使用：这句话中有 **加粗的 `code`**，有 *斜体加 <u>下划线</u>*，还有 <mark>**高亮加粗**</mark>。

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
