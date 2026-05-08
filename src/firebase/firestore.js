import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, where, onSnapshot,
  serverTimestamp, GeoPoint, writeBatch,
} from 'firebase/firestore'
import { db } from './config'

// ── SHELTERS ────────────────────────────────────────────

export function subscribeShelters(userId, callback) {
  const q = query(
    collection(db, 'shelters'),
    where('ownerId', '==', userId)
  )
  return onSnapshot(q, (snap) => {
    const shelters = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    callback(shelters)
  })
}

export async function addShelter(userId, displayName, { name, type, lat, lng, notes, address }) {
  return addDoc(collection(db, 'shelters'), {
    ownerId:      userId,
    ownerName:    displayName,
    name:         name || null,
    type,
    location:     new GeoPoint(lat, lng),
    notes:        notes || null,
    address:      address || null,
    isImported:   false,
    importedFrom: null,
    sharedVia:    null,
    createdAt:    serverTimestamp(),
  })
}

export async function updateShelter(shelterId, updates) {
  return updateDoc(doc(db, 'shelters', shelterId), updates)
}

export async function deleteShelter(shelterId) {
  return deleteDoc(doc(db, 'shelters', shelterId))
}

// ── USER PROFILE ────────────────────────────────────────

export async function saveHomeLocation(userId, lat, lng) {
  return updateDoc(doc(db, 'users', userId), {
    homeLocation: new GeoPoint(lat, lng),
  })
}

export async function saveUserCity(userId, city) {
  return updateDoc(doc(db, 'users', userId), { city })
}

export async function getUserProfile(userId) {
  const snap = await getDoc(doc(db, 'users', userId))
  return snap.exists() ? snap.data() : null
}

// ── SHARE LINKS ─────────────────────────────────────────

export async function createShareLink(userId, displayName, shelterIds) {
  const ref = await addDoc(collection(db, 'shareLinks'), {
    createdBy:   userId,
    creatorName: displayName,
    shelterIds,
    createdAt:   serverTimestamp(),
  })
  return ref.id
}

export async function getShareLink(shareId) {
  const snap = await getDoc(doc(db, 'shareLinks', shareId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function getSheltersByIds(ids) {
  const results = await Promise.all(
    ids.map(id => getDoc(doc(db, 'shelters', id)))
  )
  return results
    .filter(s => s.exists())
    .map(s => ({ id: s.id, ...s.data() }))
}

export async function importShelters(userId, displayName, shelters, shareId, creatorName) {
  const batch = writeBatch(db)
  for (const s of shelters) {
    const ref = doc(collection(db, 'shelters'))
    batch.set(ref, {
      ownerId:      userId,
      ownerName:    displayName,
      name:         s.name,
      type:         s.type,
      location:     s.location,
      notes:        s.notes || null,
      address:      s.address || null,
      isImported:   true,
      importedFrom: creatorName,
      sharedVia:    shareId,
      createdAt:    serverTimestamp(),
    })
  }
  return batch.commit()
}

// ── Shared Routes ──────────────────────────────────────────

export async function createSharedRoute(userId, displayName, route, distanceKm, mode) {
  const ref = await addDoc(collection(db, 'sharedRoutes'), {
    createdBy:       userId,
    creatorName:     displayName,
    waypoints:       route.waypoints,
    sheltersCovered: route.sheltersCovered,
    distanceKm,
    mode,
    createdAt:       serverTimestamp(),
  })
  return ref.id
}

export async function getSharedRoute(routeId) {
  const snap = await getDoc(doc(db, 'sharedRoutes', routeId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}
