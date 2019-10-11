import { cloneDeep, isString, flow, curry } from 'lodash'
import pathToRegexp from 'path-to-regexp'

export function arrayToTree(array, id = 'id',parentId = 'pid',children = 'list') {
    const result = []
    const hash = {}
    const data = cloneDeep(array)
    data.forEach((item, index) => {
      hash[data[index][id]] = data[index]
    })
  
    data.forEach(item => {
      const hashParent = hash[item[parentId]]
      if (hashParent) {
        !hashParent[children] && (hashParent[children] = [])
        hashParent[children].push(item)
      } else {
        result.push(item)
      }
    })
    return result
  }

export function pathMatchRegexp(regexp, pathname) {
    return pathToRegexp(regexp)
  }


export function queryAncestors(array, current, parentId, id = 'popeid') {
  const result = [current]
  const hashMap = new Map()
  array.forEach(item => hashMap.set(item[id], item))

  const getPath = current => {
    const currentParentId = hashMap.get(current[id])[parentId]
    if (currentParentId) {
      result.push(hashMap.get(currentParentId))
      getPath(hashMap.get(currentParentId))
    }
  }

  getPath(current)
  return result
}