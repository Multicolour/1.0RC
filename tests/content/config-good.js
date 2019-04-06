"use strict";
exports.__esModule = true;
var config = {
    models: "./models",
    services: {
        myService: {
            type: "api",
            port: 1811,
            security: {
                cors: {
                    allowedDomains: [
                        "http://localhost:1811",
                    ]
                }
            }
        },
        databases: {
            type: "database",
            adapter: "mysql"
        }
    }
};
exports["default"] = config;
