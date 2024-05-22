import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { type EntitySubscriberInterface, DataSource, type InsertEvent, type UpdateEvent, type RemoveEvent } from 'typeorm'
import { TypesenseCollection } from '../../typesense/enums/typesense-collection-index.enum.js'
import { TypesenseCollectionService } from '../../typesense/services/typesense-collection.service.js'
import { User } from '../entities/user.entity.js'

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
    const { entity } = event

    await this.typesense.importManuallyToTypesense(
      TypesenseCollection.USER,
      [entity]
    )
  }

  async afterUpdate (event: UpdateEvent<User>): Promise<void> {
    const { entity } = event

    await this.typesense.importManuallyToTypesense(
      TypesenseCollection.USER,
      [entity]
    )
  }

  async afterRemove (event: RemoveEvent<User>): Promise<void> {
    await this.typesense.deleteFromTypesense(TypesenseCollection.USER, event.entityId)
  }
}
