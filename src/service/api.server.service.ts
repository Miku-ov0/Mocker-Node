import { Init, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { Api } from '../entity/api.entity';
import { Context } from '@midwayjs/koa';
import { Repository } from 'typeorm';
import AntPathMatcher = require('ant-path-matcher');
import { pathToRegexp, Key } from 'path-to-regexp';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ResHandlerFactory } from '../handler/res.handler'
import { ResType } from "../enums/res.type"
const fs = require('fs');
const file = fs.createWriteStream('./outPut.txt');
let logger = new console.Console(file, file);
@Provide()
@Scope(ScopeEnum.Singleton)
export class ApiServerService {

    static SPLITOR: string = '.'
    static ALL_METHOD: string = 'ALL'
    static MATCHER = AntPathMatcher()

    @InjectEntityModel(Api)
    apiModel: Repository<Api>;

    apiMap: Map<string, Api> = new Map();

    @Init()
    async init() {
        console.log('init api server')
        await this.reloadAll();
    }

    async reloadAll() {
        const apis = await this.apiModel.find({ where: { enabled: true } })
        this.apiMap.clear()
        apis.forEach(api => {
            this.apiMap.set(api.path + ApiServerService.SPLITOR + api.method, api)
        })
        console.log(this.apiMap)
    }

    async mapping(ctx: Context) {
        const pathname = ctx.request.url.replace('/api', '')
        // console.log(ctx.URL)
        // console.log(ctx)
        const path = ctx.URL.pathname.replace('/api', '')
        const { method } = ctx.request
        // console.log(this.apiMap);

        let api =
            this.apiMap.get(pathname + ApiServerService.SPLITOR + method) ||
            this.apiMap.get(path + ApiServerService.SPLITOR + method)

        if (!api) {
            this.apiMap.forEach((v, k) => {
                if (pathToRegexp(k).exec(path + ApiServerService.SPLITOR + method)) {
                    api = v
                    return
                }
            })
        }

        if (api) {
            // console.log(ctx.request.body)
            
logger.log(JSON.stringify(ctx.request.body));

            const handler = ResHandlerFactory.getResHandler(ResType[api.resType])
            if (handler) {
                const pathVariables = this.getPathParams(api.path, path)
                const params = {
                    req: {
                        ctx,
                        query: ctx.query,
                        body: ctx.request.body,
                        headers: ctx.headers,
                        path,
                        pathname,
                        method,
                        pathVariables
                    }
                }
                return handler.handle(api.response, params) || 'response handle error'
            }
        }
    }

    getPathParams(path: string, url: string): { [key: string]: string } | null {
        const keys: Key[] = [];
        const regexp = pathToRegexp(path, keys);
        const match = regexp.exec(url);
      
        if (match) {
          return keys.reduce((params: { [key: string]: string }, key: Key, index: number) => {
            params[key.name] = match[index + 1];
            return params;
          }, {});
        }
      
        return null;
      }
}
