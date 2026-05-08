# מקלטי קריות — Design Spec
**תאריך:** 2026-05-07

## מה אנחנו בונים (בעברית פשוטה)

כפתור חדש על המפה. לוחצים → רשימה של 4 ערים. בוחרים עיר → המקלטים שלה מופיעים על המפה בדיוק כמו מקלט שמשתמש הוסיף. אפשר ללחוץ על מקלט ולערוך אותו — השינוי נשמר בחשבון.

הכפתור הנוכחי של מקלטים ציבוריים **נמחק** לחלוטין.

---

## מה נמחק

| קובץ / קוד | מה זה |
|---|---|
| `src/lib/publicShelters.js` | כל הקוד הישן של מקלטים ציבוריים |
| `src/components/map/PublicShelterMarker.jsx` | הסמן הנפרד למקלטים ציבוריים |
| `PublicSheltersForm` ב-`MapPage.jsx` (שורות 284–343) | המסך שנפתח לבחירת עיר |
| הכפתור שפותח את `PublicSheltersForm` ב-`MapPage.jsx` | הכפתור הנוכחי |
| כל ה-`import` של `publicShelters.js` ב-`MapPage.jsx` | |

---

## מה נבנה

### 1. קובץ נתונים — `src/lib/krayotShelters.js`

מגדיר את 4 הערים עם ה-bounding box שלהן (לשאילתת Overpass):

```js
export const KRAYOT_CITIES = [
  { name: 'קרית ביאליק', bbox: [32.82, 35.07, 32.87, 35.12] },
  { name: 'קרית מוצקין', bbox: [32.83, 35.06, 32.86, 35.09] },
  { name: 'קרית חיים',   bbox: [32.82, 35.04, 32.86, 35.08] },
  { name: 'קרית ים',     bbox: [32.84, 35.07, 32.87, 35.11] },
]
```

פונקציה `fetchCityShelters(cityName)`:
- שולחת שאילתת Overpass API לפי bounding box של העיר
- מחפשת `amenity=shelter` ו-`shelter_type=public_shelter`
- מחזירה מערך `[{ id, lat, lng, name }]`
- Cache בזיכרון — לא שולח שוב אם כבר נטען באותה session

### 2. Hook — `src/hooks/useKrayotShelters.js`

```js
const { shelters, loading, error } = useKrayotShelters(cityName)
```

- `cityName` = שם עיר מ-`KRAYOT_CITIES`, או `null` כשלא נבחר
- כשמשתנה cityName → קורא ל-`fetchCityShelters`
- מחזיר מערך shelters בפורמט תואם ל-`ShelterMarker`:
  ```js
  { id: `osm_${node.id}`, lat, lng, name, type: 'municipal', isPublic: true }
  ```

### 3. קומפוננטה — `src/components/map/KrayotCityPicker.jsx`

תיבה קטנה שנפתחת על המפה עם 4 כפתורים:

```
┌─────────────────────────────┐
│  🏛️ מקלטים ציבוריים — קריות │
│  [ק׳ ביאליק] [ק׳ מוצקין]   │
│  [ק׳ חיים]   [ק׳ ים]        │
│  [× סגור]                   │
└─────────────────────────────┘
```

- כפתור נבחר → צבוע/active
- לחיצה שנייה על עיר נבחרת → מסתיר מקלטים
- לחיצה על סגור → מסתיר הכל

### 4. שילוב ב-`MapPage.jsx`

**כפתור על המפה** — ליד הכפתורים הקיימים:
```jsx
<button onClick={() => setShowKrayotPicker(v => !v)}>
  🏛️ מקלטים קריות
</button>
```

**State חדש:**
```js
const [showKrayotPicker, setShowKrayotPicker] = useState(false)
const [selectedKrayotCity, setSelectedKrayotCity] = useState(null)
```

**Markers על המפה** — מוסיפים לאחר ה-shelters הרגילים:
```jsx
{krayotShelters.map(shelter => (
  <ShelterMarker
    key={shelter.id}
    shelter={shelter}
    onEdit={handleEditKrayotShelter}
    onDelete={null}
    currentUserId={user?.uid}
  />
))}
```

### 5. עריכת מקלט ציבורי — `handleEditKrayotShelter`

כשמשתמש לוחץ "ערוך" על מקלט ציבורי:
1. נפתח אותו טופס עריכה שקיים (`ShelterForm`)
2. שמירה → `addShelter(user.uid, { ...editedData, type: 'municipal', sourceOsmId: shelter.id })`
3. המקלט נשמר ב-Firebase כמקלט רגיל של המשתמש
4. `ShelterMarker` מציג "ערוך" רק כשיש `onEdit` prop — לא מציג "מחק" למקלטים ציבוריים שלא נשמרו

---

## Data Flow

```
לחיצה על עיר
     ↓
useKrayotShelters(cityName)
     ↓
fetchCityShelters → Overpass API
     ↓
[{id, lat, lng, name, type:'municipal'}]
     ↓
ShelterMarker × N על המפה
     ↓ (אם ערוך)
ShelterForm → addShelter → Firebase
```

---

## מה לא בסקופ

- CORS fix לאזעקות (נפרד)
- OSRM (מסלול ברחובות)
- ערים מחוץ לקריות
- מחיקת מקלט ציבורי

---

## אימות (Verification)

1. `npm run dev` → פותחים עמוד מפה
2. לוחצים "מקלטים קריות" → נפתחת רשימת 4 ערים
3. בוחרים "קרית ביאליק" → markers מופיעים על המפה
4. markers נראים זהים למקלטים רגילים (ירוק = עירוני)
5. לוחצים על marker → popup עם "ערוך"
6. עורכים שם → שומרים → מופיע בחשבון
7. בוחרים עיר שנייה → markers של עיר חדשה מופיעים
8. לחיצה שנייה על עיר → markers נעלמים
