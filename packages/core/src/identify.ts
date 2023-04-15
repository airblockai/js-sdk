import {
  Identify as IIdentify,
  IdentifyOperation,
  IdentifyUserProperties,
  ValidPropertyType
} from '@airblock-sdk/types'

export const UNSET_VALUE = '-'
const MAX_PROPERTY_KEYS = 1000

export const isValidObject = (properties: { [key: string]: any }): boolean => {
  if (Object.keys(properties).length > MAX_PROPERTY_KEYS) {
    return false
  }
  for (const key in properties) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value = properties[key]
    if (!isValidProperties(key, value)) return false
  }
  return true
}

export const isValidProperties = (property: string, value: any): boolean => {
  if (typeof property !== 'string') return false
  if (Array.isArray(value)) {
    let isValid = true
    for (const valueElement of value) {
      if (Array.isArray(valueElement)) {
        return false
      } else if (typeof valueElement === 'object') {
        isValid = isValid && isValidObject(valueElement as object)
      } else if (!['number', 'string'].includes(typeof valueElement)) {
        return false
      }
      if (!isValid) {
        return false
      }
    }
  } else if (value === null || value === undefined) {
    return false
  } else if (typeof value === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return isValidObject(value)
  } else if (!['number', 'string', 'boolean'].includes(typeof value)) {
    return false
  }
  return true
}

export class Identify implements IIdentify {
  protected readonly _propertySet: Set<string> = new Set<string>()
  protected _properties: IdentifyUserProperties = {}

  public getUserProperties(): IdentifyUserProperties {
    return { ...this._properties }
  }

  public set(property: string, value: ValidPropertyType): Identify {
    this._safeSet(IdentifyOperation.SET, property, value)
    return this
  }

  public setOnce(property: string, value: ValidPropertyType): Identify {
    this._safeSet(IdentifyOperation.SET_ONCE, property, value)
    return this
  }

  public append(property: string, value: ValidPropertyType): Identify {
    this._safeSet(IdentifyOperation.APPEND, property, value)
    return this
  }

  public prepend(property: string, value: ValidPropertyType): Identify {
    this._safeSet(IdentifyOperation.PREPEND, property, value)
    return this
  }

  public postInsert(property: string, value: ValidPropertyType): Identify {
    this._safeSet(IdentifyOperation.POSTINSERT, property, value)
    return this
  }

  public preInsert(property: string, value: ValidPropertyType): Identify {
    this._safeSet(IdentifyOperation.PREINSERT, property, value)
    return this
  }

  public remove(property: string, value: ValidPropertyType): Identify {
    this._safeSet(IdentifyOperation.REMOVE, property, value)
    return this
  }

  public add(property: string, value: number): Identify {
    this._safeSet(IdentifyOperation.ADD, property, value)
    return this
  }

  public unset(property: string): Identify {
    this._safeSet(IdentifyOperation.UNSET, property, UNSET_VALUE)
    return this
  }

  public clearAll(): Identify {
    // When clear all happens, all properties are unset. Reset the entire object.
    this._properties = {}
    this._properties[IdentifyOperation.CLEAR_ALL] = UNSET_VALUE

    return this
  }

  // Returns whether or not this set actually worked.
  private _safeSet(
    operation: IdentifyOperation,
    property: string,
    value: ValidPropertyType
  ): boolean {
    if (this._validate(operation, property, value)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let userPropertyMap: any = this._properties[operation]
      if (userPropertyMap === undefined) {
        userPropertyMap = {}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this._properties[operation] = userPropertyMap
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      userPropertyMap[property] = value
      this._propertySet.add(property)
      return true
    }

    return false
  }

  private _validate(
    operation: IdentifyOperation,
    property: string,
    value: ValidPropertyType
  ): boolean {
    if (this._properties[IdentifyOperation.CLEAR_ALL] !== undefined) {
      // clear all already set. Skipping operation;
      return false
    }

    if (this._propertySet.has(property)) {
      // Property already used. Skipping operation
      return false
    }

    if (operation === IdentifyOperation.ADD) {
      return typeof value === 'number'
    }

    if (
      operation !== IdentifyOperation.UNSET &&
      operation !== IdentifyOperation.REMOVE
    ) {
      return isValidProperties(property, value)
    }
    return true
  }
}
