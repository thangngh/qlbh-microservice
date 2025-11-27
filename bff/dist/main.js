"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'bff',
            protoPath: (0, path_1.join)(__dirname, 'proto/bff.proto'),
            url: 'localhost:50052',
        },
    });
    await app.startAllMicroservices();
}
void bootstrap();
//# sourceMappingURL=main.js.map