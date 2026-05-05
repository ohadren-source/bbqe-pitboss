# BBQE Web App - Implementation Strategy

**Date:** May 5, 2026  
**Objective:** Build full-featured BBQE web app with WiFi Check and Breach Scan before tiering/monetization  
**Approach:** Open all features to production (free) first, tier properly after validation

---

## Current State

### What Works
- **Link Scanner:** Fully functional on web
  - User inputs URL
  - Calls `/api/bbqe/scan-link`
  - Returns threat level, score, findings
  - Counts against 9-try limit

### What's Missing
- **WiFi Check:** UI exists, locked behind Premium paywall, NO implementation
- **Breach Scan:** UI exists, locked behind PitBoss paywall, NO implementation

### The Problem
Users purchase Premium/PitBoss → features remain locked because they were never built. Features need to exist and work BEFORE monetization.

---

## Implementation Strategy

### Phase 1: WiFi Check (Universal Web Implementation)

#### User Flow
1. User navigates to "WiFi Check" tab (now unlocked)
2. User inputs:
   - WiFi Network Name (SSID)
   - Encryption Type (Open, WEP, WPA, WPA2, WPA3)
   - (Optional) Signal Strength, Band (2.4GHz/5GHz)
3. User clicks "Analyze Network"
4. Frontend sends request to backend

#### Technical Implementation

**Frontend (React/TypeScript in App.tsx):**
```
- Remove isSubscribed check that locks "wifi-check" tab
- Create handleWifiCheck() async function
- Accept SSID, encryption type, optional signal strength/band
- Call POST /api/bbqe/check-wifi with:
  {
    customerId: fingerprint,
    ssid: string,
    encryption: string,
    signalStrength?: number,
    band?: string
  }
- Parse response: vulnerabilities, threat level, recommendations
- Display findings in result box
- Increment scanCount (counts as 1 of 9 tries)
- Handle 403 error (limit reached) - prompt upgrade
```

**Backend Endpoint:**
- `POST /api/bbqe/check-wifi`
- Analyzes network against:
  - Known weak encryption patterns (WEP deprecated, WPA2 vulnerable to KRACK, etc.)
  - SSID spoofing patterns
  - Rogue access point signatures
  - Common misconfiguration vulnerabilities
- Returns: threat level (LOW/MEDIUM/HIGH/CRITICAL), score (0-100), findings[], recommendations[]

**Counter Logic:**
- WiFi Check counts as 1 of 9 free tries
- After 9 tries, user sees upgrade prompt (future tier)
- Premium/PitBoss users get unlimited

---

### Phase 2: Breach Scan (Email Check)

#### User Flow
1. User navigates to "Breach Scan" tab (now unlocked)
2. User inputs: Email address
3. User clicks "Check Email"
4. Frontend sends request to backend

#### Technical Implementation

**Frontend (React/TypeScript in App.tsx):**
```
- Remove isSubscribed check that locks "breach-scan" tab
- Create handleBreachScan() async function
- Accept email address
- Call POST /api/bbqe/check-threat with:
  {
    customerId: fingerprint,
    email: string
  }
- Parse response: isBreach (boolean), breachCount, sources[], dates[]
- Display findings in result box
- Increment scanCount (counts as 1 of 9 tries)
- Handle 403 error (limit reached) - prompt upgrade
```

**Backend Endpoint:**
- `POST /api/bbqe/check-threat`
- Queries RapidAPI breach databases (already integrated per Privacy Policy)
- Returns: isBreach (boolean), breachCount, sources (array of breach names), affectedData (array), dates (array)

**Counter Logic:**
- Breach Scan counts as 1 of 9 free tries
- After 9 tries, user sees upgrade prompt (future tier)
- PitBoss users get unlimited

---

## UI Changes Required

### App.tsx Modifications

1. **Remove subscription locks on tabs:**
   ```tsx
   // BEFORE:
   <button className="bbqe-tab-pill bbqe-tab-locked" disabled>WiFi Check 🔒</button>
   
   // AFTER:
   <button className="bbqe-tab-pill" onClick={() => setActiveTab('wifi-check')}>WiFi Check</button>
   ```

2. **Remove locked-content divs:**
   - Delete "🔒 Premium Feature" badge from wifi-check tab
   - Delete "🔒 PitBoss Feature" badge from breach-scan tab
   - Replace with functional input forms

3. **Create WiFi Check form:**
   ```tsx
   <input placeholder="WiFi Network Name (SSID)" ... />
   <select>
     <option>Open</option>
     <option>WEP</option>
     <option>WPA</option>
     <option>WPA2</option>
     <option>WPA3</option>
   </select>
   <button onClick={handleWifiCheck}>Analyze Network</button>
   ```

4. **Create Breach Scan form:**
   ```tsx
   <input type="email" placeholder="your@email.com" ... />
   <button onClick={handleBreachScan}>Check Email</button>
   ```

5. **Remove premium-section upgrade pill** (all features free now)
   - Can re-add after tiering is implemented

---

## Data Flow

### WiFi Check
```
User Input (SSID, Encryption)
        ↓
handleWifiCheck()
        ↓
POST /api/bbqe/check-wifi
        ↓
Backend Analysis (RapidAPI, threat DB)
        ↓
Response: { threatLevel, score, findings, recommendations }
        ↓
Display Result Box
        ↓
Increment scanCount
```

### Breach Scan
```
User Input (Email)
        ↓
handleBreachScan()
        ↓
POST /api/bbqe/check-threat
        ↓
Backend Query (RapidAPI breach DB)
        ↓
Response: { isBreach, breachCount, sources, affectedData }
        ↓
Display Result Box
        ↓
Increment scanCount
```

---

## Counter & Limits

**9 Free Tries Across All Features:**
- Link Scanner: 1 try per scan
- WiFi Check: 1 try per analysis
- Breach Scan: 1 try per email check
- Total pool: 9 tries (any combination)
- After 9: "Upgrade to Premium" prompt (UI only, no paywall enforcement yet)

---

## Testing Checklist

### WiFi Check
- [ ] Tab unlocks and shows input form
- [ ] User can input SSID + encryption type
- [ ] Submit calls `/api/bbqe/check-wifi` correctly
- [ ] Result displays threat level, score, findings
- [ ] Counter increments
- [ ] After 9 tries, upgrade prompt shows

### Breach Scan
- [ ] Tab unlocks and shows email input
- [ ] User can input email address
- [ ] Submit calls `/api/bbqe/check-threat` correctly
- [ ] Result displays breach status, sources, affected data
- [ ] Counter increments
- [ ] After 9 tries, upgrade prompt shows

### Integration
- [ ] All 3 tabs accessible without subscription
- [ ] Counter shared across all features
- [ ] Loading states work
- [ ] Error handling (403, network errors, etc.)
- [ ] Mobile responsive

---

## Deployment Order

1. **Build WiFi Check** → Test → Deploy
2. **Verify WiFi Check works** in production
3. **Build Breach Scan** → Test → Deploy
4. **Verify Breach Scan works** in production
5. **Add tiering logic** (Premium/PitBoss limits)
6. **Launch monetization**

---

## Notes

- No dummy data — all queries must hit real backend endpoints
- Universal approach: works on desktop + mobile browsers
- User provides network info manually (no direct WiFi API access from browser)
- Privacy Policy already covers both features (breach checks via RapidAPI, on-device WiFi analysis)
- Support docs already reference these features as working

---

**Status:** Ready for Phase 1 (WiFi Check implementation)
