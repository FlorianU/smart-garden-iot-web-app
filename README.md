# IoT Smart Garden

Welcome to the **IoT Smart Garden** project! This project is a NestJS-based server designed to provide a robust REST API and MQTT-based subscription and publishing functionality. The system enables control of smart gardening systems, including lighting and watering, and offers real-time sensor data collection and monitoring.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [MQTT Integration](#mqtt-integration)
- [System Overview](#system-overview)
- [Authors](#authors)
- [License](#license)

---

## Features

- **REST API**: Provides endpoints to manage and monitor the smart gardening system.
- **MQTT Integration**: Allows subscription and publishing to an MQTT broker for real-time control and updates.
- **Smart Lighting Control**: Manage and automate lighting schedules for your garden.
- **Smart Watering Control**: Enable precise watering control with real-time adjustments.
- **Real-Time Sensor Data**: Retrieve live sensor data (e.g., soil moisture, temperature, humidity).
- **Scalable and Modular**: Built with NestJS for a highly scalable and modular architecture.

---

## Technologies Used

- **Node.js** with **NestJS** framework for backend development.
- **TypeScript** for type-safe programming.
- **MQTT** for lightweight messaging and real-time communication.
- **REST API** for structured and easy integration.
- **Docker** (optional) for containerized deployment.

---

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/FlorianU/smart-garden-iot-web-app.git
   cd smart-garden-iot-web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory and configure the following variables:
   ```env
   MQTT_BROKER_URL, MQTT_USERNAME, MQTT_PASSWORD, API_PORT
   ```

### Running the Application

- **Development Mode:**

  ```bash
  npm run start:dev
  ```

- **Production Mode:**

  ```bash
  npm run build
  npm run start:prod
  ```

- **Running with Docker (optional):**
  ```bash
  docker build -t smart-garden-iot-web-app .
  docker run -p 3000:3000 smart-garden-iot-web-app
  ```

---

## MQTT Integration

This application integrates with an MQTT broker to:

- Subscribe to topics for real-time updates from sensors.
- Publish commands to control lights and watering systems.

## System Overview

### Architecture

- **Controllers**: Handle HTTP requests and MQTT communication.
- **Services**: Encapsulate business logic.
- **Modules**: Organize the application by features (e.g., Lighting, Watering, Sensors).

### Flow

1. User interacts with the REST API or MQTT broker.
2. Commands are processed by controllers and passed to services.
3. Services interact with the MQTT broker or database (if applicable).
4. Real-time updates are sent back to the user via MQTT or API responses.

---

## Authors

- Eman Mhesin
- Fatereh Tondro
- Florian Unger

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
