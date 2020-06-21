export default{
    jwtSecret: process.env.JWT_SECRET || 'somesecrettoken',
    DB: {
        URI: "mongodb://localhost:27035/test"
    }
}