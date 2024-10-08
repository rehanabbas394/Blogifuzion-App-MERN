const fs = require("fs");

function RequestMiddleware(filename) {
    return (req, res, next) => {
        const logEntry = `\n${Date.now()}: ${req.ip} ${req.method}:${req.path}\n`;
        
        fs.appendFile(filename, logEntry, (err) => {
            if (err) {
                console.error(`Error writing to log file: ${err.message}`);
            }
            // Proceed to the next middleware or route handler
            next();
        });
    };
}
module.exports = RequestMiddleware