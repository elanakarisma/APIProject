# Node + Express Service Starter

This is a simple API sample in Node.js with express.js based on [Google Cloud Run Quickstart](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service).

## Getting Started
```
- membuat dua user yaitu admin dan donatur
- membuat dua table yaitu user dan donasi
- membuat dua route yaitu /user dan /donasi
- membuat privilage dimana admin tidak bisa memakukan inset into atau menambahkan data donasi
- membuat middleware untuk mengecek apakah user yang login adalah admin atau donatur
- membuat privilage agar yang bisa melakukan delete dan update edit adalah admin
- membuat logika agar user hanya dapat melihat donasi yang telah dia donasikan
```
`tutorial penggunaan di file cara_jalankan.txt`

Server should run automatically when starting a workspace. To run manually, run:
```sh
npm install
npm install cors
node index.js
```