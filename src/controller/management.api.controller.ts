import { Inject, Controller, Get, Put, Post, Query, Body, Del, Param } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApiService } from '../service/api.service';
import { ApiServerService } from '../service/api.server.service';
import { Api } from '../entity/api.entity';

@Controller('/management/api')
export class APIManagementController {
  @Inject()
  ctx: Context;

  @Inject()
  apiService: ApiService;

  @Inject()
  apiServerService: ApiServerService;

  @Get('/page')
  async page(@Query('page') page = 0, @Query('size') size = 10, @Query('name') name, @Query('path') path) {
    const apis = await this.apiService.apiPage({ name, path }, { page, size });
    return { success: true, message: 'OK', data: apis };
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    const api = await this.apiService.getById(id);
    return { success: true, message: 'OK', data: api };
  }

  @Put()
  async modify(@Body() api: Api) {
    this.apiService.modify(api);
    return { success: true, message: 'OK', data: null };
  }

  @Post()
  async create(@Body() api: Api) {
    this.apiService.create(api);
    return { success: true, message: 'OK', data: null };
  }

  @Del()
  async delete(@Query('id') id: number) {
    this.apiService.delete(id)
    return { success: true, message: 'OK', data: null };
  }

  @Post('/reload')
  async reload() {
    this.apiServerService.reloadAll();
    return { success: true, message: 'OK', data: null };
  }
}
