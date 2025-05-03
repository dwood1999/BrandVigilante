module.exports = {
  apps: [{
    name: "brandvigilante",
    script: "build/index.js",
    args: "--port 3121",
    env: {
      NODE_ENV: "production",
      PORT: 3121
    },
    instances: "max",
    exec_mode: "cluster"
  }]
};
