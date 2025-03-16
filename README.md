## 我的个人主页

基于 Next.js 开发，重构于我之前使用 React 开发的[个人主页](https://github.com/1Yie/home)，仅学习使用。

页面样式来源：[VoidZero](https://voidzero.dev)

demo：[ichiyo(@1Yie)](https://ichiyo.in)

## 博客

博客使用 Markdown 编写，通过在 `src/app/blog/post` 目录下获取 md 文件，通过 `gray-matter` 解析成 HTML，然后在 Next.js 中渲染。

> 每次更新博客请 `npm run build` 后再部署

## 部署

```bash
clone https://github.com/1Yie/home-nextjs.git

npm i

npm run dev
```
