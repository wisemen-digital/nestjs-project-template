export function sortEntitiesByUuids<T extends { uuid: string }> (
  uuids: string[],
  entities: T[]
): T[] {
  return uuids.map((uuid) => {
    const entity = entities.find(entity => entity.uuid === uuid)

    if (entity == null) {
      throw new Error(`Entity with UUID ${uuid} not found`)
    }

    return entity
  })
}
