import config from "./environment.js"

const connection = {
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD
}

export default connection;