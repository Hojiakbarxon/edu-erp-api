import NodeCache from "node-cache"

let cache = new NodeCache()

export function setCache(key: string, value: string) {
    let data = cache.set(key, value, 300)
    return data
}
export function getCache(key: string) {
    return cache.get(key)
}

export function delCache(key : string){
    return cache.del(key)
}