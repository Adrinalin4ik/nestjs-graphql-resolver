import { DynamicModule, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ApplicationConfig, HttpAdapterHost } from '@nestjs/core';
import { ApolloServerBase } from 'apollo-server-core';
import { GatewayBuildService, GatewayModuleAsyncOptions, GatewayModuleOptions } from '../interfaces';
export declare class GraphQLGatewayModule implements OnModuleInit, OnModuleDestroy {
    private readonly httpAdapterHost;
    private readonly buildService;
    private readonly options;
    private readonly applicationConfig;
    private _apolloServer;
    get apolloServer(): ApolloServerBase;
    constructor(httpAdapterHost: HttpAdapterHost, buildService: GatewayBuildService, options: GatewayModuleOptions, applicationConfig: ApplicationConfig);
    static forRoot(options: GatewayModuleOptions): DynamicModule;
    static forRootAsync(options: GatewayModuleAsyncOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private registerGqlServer;
    private registerExpress;
    private registerFastify;
    private getNormalizedPath;
}
