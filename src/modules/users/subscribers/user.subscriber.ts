import { type EntitySubscriberInterface, type InsertEvent, DataSource, type RemoveEvent, type UpdateEvent } from 'typeorm'
import { InjectDataSource } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { User } from '../entities/user.entity.js'
import { TypesenseCollectionService } from '../../typesense/services/typesense-collection.service.js'
import { TypesenseAliasName } from '../../typesense/enums/typesense-collection.index.enum.js'

@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor (
    @InjectDataSource() readonly dataSource: DataSource,
    private readonly typesense: TypesenseCollectionService
  ) {
    dataSource.subscribers.push(this)
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  listenTo (): string | Function {
    return User
  }

  async afterInsert (event: InsertEvent<User>): Promise<void> {
    await this.typesense.importManuallyToTypesense(
      TypesenseAliasName.USER,
      [event.entity]
    )
  }

  async afterUpdate (event: UpdateEvent<User>): Promise<void> {
    await this.typesense.importToTypesense(TypesenseAliasName.USER, [event.entity?.uuid])
  }

  async afterRemove (event: RemoveEvent<User>): Promise<void> {
    await this.typesense.deleteFromTypesense(TypesenseAliasName.USER, event.entityId)
  }
}
