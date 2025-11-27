import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
export declare class DatabaseConfigService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions;
}
