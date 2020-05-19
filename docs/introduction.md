# Introduction

## Motivation

动机

Many APIs, public or not, return JSON data that has deeply nested objects. Using data in this kind of structure is often very difficult for JavaScript applications, especially those using [Flux](http://facebook.github.io/flux/) or [Redux](http://redux.js.org/).

许多 API（无论是否公开）都会返回具有深层嵌套对象的 JSON 数据。 对于 JavaScript 应用程序而言，使用这样的数据通常非常难受，尤其是那些使用 [Flux](http://facebook.github.io/flux) 或 [Redux](http://redux.js.org/) 的应用。

## Solution

解决方案

Normalizr is a small, but powerful utility for taking JSON with a schema definition and returning nested entities with their IDs, gathered in dictionaries.

Normalizr 是一个小巧但功能强大的工具，它通过预先定义的模式来解析 JSON，并返回嵌套在字典中的 ID 及其嵌套实体。

### Example

例子

The following nested object:

下列嵌套对象：

```js
[
  {
    id: 1,
    title: 'Some Article',
    author: {
      id: 1,
      name: 'Dan'
    }
  },
  {
    id: 2,
    title: 'Other Article',
    author: {
      id: 1,
      name: 'Dan'
    }
  }
];
```

Can be normalized to:

可以被规范化为：

```js
{
  result: [1, 2],
  entities: {
    articles: {
      1: {
        id: 1,
        title: 'Some Article',
        author: 1
      },
      2: {
        id: 2,
        title: 'Other Article',
        author: 1
      }
    },
    users: {
      1: {
        id: 1,
        name: 'Dan'
      }
    }
  }
}
```

## Build Files

打包后的文件

Normalizr is built for various environments

Normalizr 适用于各种环境

- `src/*`
  - CommonJS, unpacked files. These are the recommended files for use with your own package bundler and are the default in-point as defined by this modules `package.json`.
- `normalizr.js`, `normalizr.min.js`
  - [CommonJS](http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)
- `normalizr.amd.js`, `normalizr.amd.min.js`
  - [Asynchronous Module Definition](http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)
- `normalizr.umd.js`, `normalizr.umn.min.js`
  - [Universal Module Definition](http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)
- `normalizr.browser.js`, `normalizr.browser.min.js`
  - [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) / Immediately-Invoked Function Expression, suitable for use as a standalone script import in the browser.
  - Note: It is not recommended to use packages like Normalizr with direct browser `<script src="normalizr.js"></script>` tags. Consider a package bundler like [webpack](https://webpack.github.io/), [rollup](https://rollupjs.org/), or [browserify](http://browserify.org/) instead.
