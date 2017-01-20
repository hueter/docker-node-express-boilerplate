# Dockerized Node 7 + Express + MongoDB + Nginx


![Docker-Node-Express](https://i.imgsafe.org/c5db876bee.png)

## Purpose

This is boilerplate code that you can feel free to pick apart and use for building Node APIs with Docker, Node/Express, Mongoose, and Nginx. The Javascript uses ES6 syntax.
There are basic GET/POST/PATCH/DELETE endpoints and corresponding database methods.

## How to Install & Run

0. Fork/Clone the repo
1. Run `npm i`
2. Run `docker-compose up` (Assuming you've installed docker for OSX/Windows or Docker toolkit)
3. Server is accessible at `http://localhost:5000` if you have Docker for Windows or Mac. Use `http://localhost` without specifying the port to hit the NGINX proxy. If you are using Docker toolkit, you'll need to hit the IP of the docker-machine (port rules are the same.)
