import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { PageParam } from '../interface';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Api } from '../entity/api.entity';
import { Repository } from 'typeorm';
import { ApiServerService } from './api.server.service';

@Provide()
@Scope(ScopeEnum.Singleton)
export class ApiService {

  @InjectEntityModel(Api)
  apiModel: Repository<Api>;

  @Inject()
  apiServerService: ApiServerService;

  async getById(id: number): Promise<Api> {
    return this.apiModel.findOne({ where: {id} })
  }

  async apis(where = { enabled: true }): Promise<Api[]> {
    return this.apiModel.find({ where: where })
  }

  async apiPage(param, pageObj: PageParam) {
    const { page, size } = pageObj
    for (let key in param) {
      if (param[key] === null || param[key] === undefined || param[key] === '') {
        delete param[key];
      }
    }
    console.log(param)

    const [apis, total] = await this.apiModel.createQueryBuilder()
      .where(param)
      .skip(page * size)
      .take(size)
      .getManyAndCount()

    return {
      page, size, records: apis, total
    };
  }

  async modify(api: Api) {
    const now = new Date()
    api.updatedTime = now
    console.log("modify api:", api)
    await this.apiModel.save(api)
    this.apiServerService.reloadAll()
  }

  async create(api: Api) {
    const now = new Date()
    api.createdTime = now
    api.updatedTime = now

    console.log("create api:", api)
    await this.apiModel.save(api)
    this.apiServerService.reloadAll()
  }

  async delete(id: number) {
    console.log("delete api:", id)
    await this.apiModel.delete({ id })
    this.apiServerService.reloadAll()
  }
}
