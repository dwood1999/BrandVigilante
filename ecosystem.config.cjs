module.exports = {
  apps: [{
    name: "brandvigilante",
    script: "build/index.js",
    args: "--port 3121",
    env: {
      NODE_ENV: "production",
      PORT: 3121,
      DB_HOST: "localhost",
      DB_USER: "dwood",
      DB_PASSWORD: "p3ter[thiel]",
      DB_NAME: "dwood_db"
    },
    instances: "max",
    exec_mode: "cluster"
  }]
};
