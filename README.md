<h1 align="center">
  📝 Note Rack
</h1>

## 🌳 Features
* Basic Markdown Syntax
  * H1, H2, H3, H4, H5
  * Quotes
* Custom Markdown Syntax
  * Call Outs
* Page Management
  * Sub Pages
  * Page Navigation
  * Page Styling
* Exporting
  * [PDF Exporting](./images/Note%20Rack%20Page.pdf)

## 📦 Installation
1. Install Docker and Docker Compose
  - [Docker](https://docs.docker.com/get-docker/)
  - [Docker Compose](https://docs.docker.com/compose/install/)

2. Clone the repository or download the zip file
  * Cloning the repo
    ```bash
    git clone https://github.com/Eroxl/Note-Rack.git
    ```
  * Or download the [zip file](https://github.com/Eroxl/Note-Rack/archive/refs/heads/main.zip)

3. Navigate to the repository
  * If you cloned the repo
    ```bash
    cd ./note-rack
    ```
  * If you downloaded the zip file
    1. Locate the zip file
    2. Unzip the file
    3. Navigate to the folder
      ```bash
      cd ./Note-Rack-main
      ```

4. Copy the server environment file and fill in the values
  ```bash
  cd ./backend && \
  cp .env.example .env
  ```

5. Copy the client environment file and fill in the values
  ```bash
  cd ../web && \
  cp .env.example .env
  ```

6. Run the Docker Compose file
  ```bash
  docker-compose up --build
  ```

7. Navigate to the web application at [http://127.0.0.1:3000](http://127.0.0.1:3000)

## 🎹 Keybinds
- Headings
  - `#` - H1
  - `##` - H2
  - `###` - H3
  - `####` - H4
  - `#####` - H5
- Other
  - `>` Quote
  - `|` Callout
  -  `[[ Page Name ]]` Page ("Page Name" can be any string)

## 🔬 Examples

#### Current State (dark)
<img src="./images/Desktop_Current_State_Dark.png" width="500">

#### Current State (light)
<img src="./images/Desktop_Current_State.png" width="500">
