# Pithekos
## A Monkey-First Scripture Editor

Tested on Ubuntu 24.04 with
- npm 9.2.0
- node 18.19.1
- rustc 1.75

### Getting Rust
`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

See https://www.rust-lang.org/tools/install

### Installation
```
mkdir ~/GITTEST # Currently required
cd client
npm install
npm run build
cd ../server
cargo run
```

### Usage
Connect to localhost:8000, using Firefox if Graphite fonts are needed

Enable Internet with the toggle top left

Go to Download

Paste in an https URL from a github-like server, eg
- https://git.door43.org/BurritoTruck/en_tsn.git
- https://git.door43.org/BurritoTruck/en_bsb.git
- https://github.com/Proskomma/ar-textTranslation-New_Testament-vandyke.git
- https://github.com/Proskomma/en-x-resourcelinks-Bible-ubs-images.git

Repos show up on homepage. Select some of them.

Click on one of the "write" icons in the rightmost column

Change book with, eg, "MRK 1"

Note that USJ rendering is currently slow - we plan to fix this shortly.

### If dev bugs lead to zombie processes hogging port 8000:
```
# Get PID of process
lsof -i:8000
# Kill process
kill -s sigkill <pid>
```