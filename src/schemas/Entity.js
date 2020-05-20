import * as ImmutableUtils from './ImmutableUtils';

// 返回一个函数，这个函数接收一个对象，获取对象的 idAttribute 属性的值
const getDefaultGetId = (idAttribute) => (input) =>
  ImmutableUtils.isImmutable(input) ? input.get(idAttribute) : input[idAttribute];

export default class EntitySchema {
  constructor(key, definition = {}, options = {}) {
    // key 必须得有，且必须是字符串. eg: key = 'tacos'
    if (!key || typeof key !== 'string') {
      throw new Error(`Expected a string key for Entity, but found ${key}.`);
    }

    const {
      // string | function，function 时即为获取 object 表示 <id> 属性值的方法
      idAttribute = 'id',
      mergeStrategy = (entityA, entityB) => {
        return { ...entityA, ...entityB };
      },
      processStrategy = (input) => ({ ...input }),
      fallbackStrategy = (key, schema) => undefined
    } = options;

    this._key = key;
    // 得到一个获取一个对象的 ID 值的方法，这个 ID 并不一定是属性名就叫 id，也可以叫 key 之类的
    this._getId = typeof idAttribute === 'function' ? idAttribute : getDefaultGetId(idAttribute);
    // id 名称或获取 ID 值的方法
    this._idAttribute = idAttribute;
    // TODO: 等回过头来解释这些属性
    this._mergeStrategy = mergeStrategy;
    this._processStrategy = processStrategy;
    this._fallbackStrategy = fallbackStrategy;
    this.define(definition);
  }

  get key() {
    return this._key;
  }

  get idAttribute() {
    return this._idAttribute;
  }

  define(definition) {
    this.schema = Object.keys(definition).reduce((entitySchema, key) => {
      const schema = definition[key];
      return { ...entitySchema, [key]: schema };
    }, this.schema || {});
  }

  getId(input, parent, key) {
    return this._getId(input, parent, key);
  }

  merge(entityA, entityB) {
    return this._mergeStrategy(entityA, entityB);
  }

  fallback(id, schema) {
    return this._fallbackStrategy(id, schema);
  }
  //
  normalize(input, parent, key, visit, addEntity, visitedEntities) {
    const id = this.getId(input, parent, key);
    const entityType = this.key;

    if (!(entityType in visitedEntities)) {
      visitedEntities[entityType] = {};
    }
    if (!(id in visitedEntities[entityType])) {
      visitedEntities[entityType][id] = [];
    }
    if (visitedEntities[entityType][id].some((entity) => entity === input)) {
      return id;
    }
    visitedEntities[entityType][id].push(input);

    const processedEntity = this._processStrategy(input, parent, key);
    Object.keys(this.schema).forEach((key) => {
      if (processedEntity.hasOwnProperty(key) && typeof processedEntity[key] === 'object') {
        const schema = this.schema[key];
        const resolvedSchema = typeof schema === 'function' ? schema(input) : schema;
        processedEntity[key] = visit(
          processedEntity[key],
          processedEntity,
          key,
          resolvedSchema,
          addEntity,
          visitedEntities
        );
      }
    });

    addEntity(this, processedEntity, input, parent, key);
    return id;
  }

  denormalize(entity, unvisit) {
    if (ImmutableUtils.isImmutable(entity)) {
      return ImmutableUtils.denormalizeImmutable(this.schema, entity, unvisit);
    }

    Object.keys(this.schema).forEach((key) => {
      if (entity.hasOwnProperty(key)) {
        const schema = this.schema[key];
        entity[key] = unvisit(entity[key], schema);
      }
    });
    return entity;
  }
}
