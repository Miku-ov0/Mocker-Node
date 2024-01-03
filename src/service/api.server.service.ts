import { Init, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { Api } from '../entity/api.entity';
import { Context } from '@midwayjs/koa';
import { Repository } from 'typeorm';
import AntPathMatcher = require('ant-path-matcher');
import { InjectEntityModel } from '@midwayjs/typeorm';

@Provide()
@Scope(ScopeEnum.Singleton)
export class ApiServerService {

    static SPLITOR: string = '.'
    static ALL_METHOD: string = 'ALL'
    static MATCHER = AntPathMatcher()

    @InjectEntityModel(Api)
    apiModel: Repository<Api>;

    apiMap: Map<string, string> = new Map();

    @Init()
    async init() {
        console.log('init api server')
        await this.reloadAll();
    }

    async reloadAll() {
        const apis = await this.apiModel.find({ where: { enabled: true } })
        this.apiMap.clear()
        apis.forEach(api => {
            this.apiMap.set(api.path + ApiServerService.SPLITOR + api.method, api.response)
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

        let response =
            this.apiMap.get(pathname + ApiServerService.SPLITOR + method) ||
            this.apiMap.get(path + ApiServerService.SPLITOR + method) ||
            this.apiMap.get(pathname + ApiServerService.SPLITOR + ApiServerService.ALL_METHOD) ||
            this.apiMap.get(path + ApiServerService.SPLITOR + ApiServerService.ALL_METHOD)

        if (!response) {
            this.apiMap.forEach((v, k) => {
                console.log("k = ", k, ", path = ", path, ", pathname = ", pathname)
                if (ApiServerService.MATCHER.match(k, pathname + ApiServerService.SPLITOR + method)) {
                    console.log(k + ' matchd ' + pathname)
                    response = v
                }
                if (ApiServerService.MATCHER.match(k, path + ApiServerService.SPLITOR + method)) {
                    console.log(k + ' matchd ' + path)
                    response = v
                }
            })
        }
        return response
    }
}
