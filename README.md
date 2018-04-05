# Dockerized Node 9 + Express + MongoDB + Nginx

## Purpose

This is boilerplate code that you can feel free to pick apart and re-use for building Node.js APIs with Docker, Node/Express, Mongoose, and Nginx. The JavaScript files use ES8 syntax.
There are basic GET/POST/PATCH/DELETE endpoints and corresponding database methods.

## How to Install & Run

0.  Fork/Clone the repo
1.  Run `docker-compose up` (Assuming you've installed docker for OSX/Windows or Docker toolkit)
1.  Server is accessible at `http://localhost:5000` if you have Docker for Windows or Mac. Use `http://localhost` without specifying the port to hit the NGINX proxy. If you are using Docker toolkit, you'll need to hit the IP of the docker-machine (port rules are the same.)
