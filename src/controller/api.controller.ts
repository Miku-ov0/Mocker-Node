import { Inject, All, Controller } from "@midwayjs/core";
import { ApiServerService } from "../service/api.server.service";
import { Context } from '@midwayjs/koa';

@Controller('/api')
export class ApiController {
    @Inject()
    ctx: Context;

    @Inject()
    apiServerService: ApiServerService;

    @All('/**')
    async api() {
        return await this.apiServerService.mapping(this.ctx)
            || { success: false, message: '404 Not Found', data: `${this.ctx.method} ${this.ctx.url.replace('/api', '')} perhaps not defined` };
    }

}
