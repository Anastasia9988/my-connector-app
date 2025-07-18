# Getting Started with Create React App

# 🟦 my-connector-app

Интерактивный визуальный конструктор для соединения двух прямоугольников с настраиваемыми портами. Можно менять размеры, положение, углы соединений, а линия между ними всегда строится оптимально.

[![Deploy to Vercel](https://img.shields.io/badge/Live%20Demo-blue?style=for-the-badge&logo=vercel)](https://my-connector-app.vercel.app/)

---

## 🚀 Особенности

- **Drag-n-drop** — перетаскивание обоих прямоугольников на Canvas
- Ввод координат центра, ширины и высоты через интерфейс
- Гибкая настройка углов и смещений портов (connection points)
- Ломаная соединительная линия всегда корректно обходит прямоугольники и строится по кратчайшему пути
- Автоматическая валидация портов (невозможно сделать невалидный порт через UI)
- Покрыт unit‑тестами (Jest)

---

## 🖥 Демо

👉 [my-connector-app.vercel.app](https://my-connector-app.vercel.app/)

---

## 📦 Быстрый старт

1. Клонируй репозиторий:

    ```sh
    git clone https://github.com/Anastasia9988/my-connector-app.git
    cd my-connector-app
    ```

2. Установи зависимости:

    ```sh
    npm install
    ```

3. Запусти приложение:

    ```sh
    npm start
    ```

Откроется на [http://localhost:3000](http://localhost:3000)

---

## 🧪 Тесты

Для запуска unit‑тестов:

```sh
npm test
