const DB_NAME = 'riw-app'
const DB_VERSION = 1
const STORE = 'shelters'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE, { keyPath: 'id' })
    }
    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror   = (e) => reject(e.target.error)
  })
}

export async function cacheShelters(shelters) {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  const store = tx.objectStore(STORE)
  store.clear()
  for (const s of shelters) store.put(s)
  return new Promise((res, rej) => {
    tx.oncomplete = res
    tx.onerror    = rej
  })
}

export async function getCachedShelters() {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readonly')
  const store = tx.objectStore(STORE)
  return new Promise((res, rej) => {
    const req = store.getAll()
    req.onsuccess = () => res(req.result || [])
    req.onerror   = () => rej(req.error)
  })
}

export async function clearShelterCache() {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  tx.objectStore(STORE).clear()
}
