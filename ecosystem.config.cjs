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
      DB_NAME: "dwood_db",
      SMTP_HOST: "mail.janusipm.com",
      SMTP_PORT: "587",
      SMTP_USER: "no-reply@janusipm.com",
      SMTP_PASS: "P@rtyup1999",
      SMTP_FROM: "no-reply@janusipm.com",
      ORIGIN: "https://janusipm.com" 

    },
    instances: "max",
    exec_mode: "cluster"
  }]
};
