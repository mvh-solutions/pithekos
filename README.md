# Pithekos
## A Monkey-First Scripture Editor

Tested on Ubuntu 24.04 with
- npm 9.2.0
- node 18.19.1
- rustc 1.75

Tested on Windows 11 with
- npm 10.7.0
- node 18.20.4
- rustc 1.82.0
- CMake 3.31.0

### Getting Rust
`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

See https://www.rust-lang.org/tools/install

## For Windows only
Install cmake from https://cmake.org/download/

### Installation 
```
cd clients/dashboard
npm install
npm run build
# Likewise for each client in the clients directory
# Script to do this intelligently coming soon...
cd ../../server
cargo run
```

### Usage
Connect to localhost:8000, using Firefox if Graphite fonts are needed

Enable Internet by clicking on the crossed-out globe, top right. (Green globe == "enabled")

Go to Download

Download some content

Repos show up under "local projects". Select some of them.

Click on one of the "write" icons in the rightmost column

Change book with, eg, "MRK 1"

Note that USJ rendering is currently slow - we plan to fix this shortly.

