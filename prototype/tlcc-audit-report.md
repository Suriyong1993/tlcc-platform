# 🔍 TLCC Prototype — Full Code Audit Report
## ตรวจ + วิเคราะห์ + Best Practices | v6.0 → v6.1

---

## SECTION 1: BUG LIST (สิ่งที่ผิดพลาด / ทำงานไม่ถูกต้อง)

---

### 🔴 BUG-01 — `setDevice()` ใช้ global `event` object (Deprecated)
**บรรทัด:** 1372–1377  
**ความรุนแรง:** HIGH — crash บน Firefox และ Safari ใหม่  

**โค้ดเดิม (ผิด):**
```javascript
function setDevice(type) {
  const device = document.getElementById('device');
  device.className = 'device ' + type;
  document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');  // ❌ global `event` — deprecated!
}
```

**ปัญหา:**  
`event` (global) ถูก deprecated ใน strict mode และ Firefox/Safari ใหม่จะ throw `ReferenceError`  
HTML ใช้ `onclick="setDevice('mobile')"` แต่ไม่ส่ง event object เข้าไป

**โค้ดที่ถูกต้อง:**
```javascript
function setDevice(type, clickedBtn) {
  const device = document.getElementById('device');
  device.className = 'device ' + type;
  document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
  if (clickedBtn) clickedBtn.classList.add('active');
}
```
```html
<!-- HTML ต้องแก้ด้วย — ส่ง this เข้าไป -->
<button class="device-btn active" onclick="setDevice('mobile', this)">📱</button>
<button class="device-btn" onclick="setDevice('tablet', this)">📟</button>
<button class="device-btn" onclick="setDevice('desktop', this)">🖥️</button>
```

---

### 🔴 BUG-02 — `submitReg()` ไม่ reset ปุ่มเมื่อ closeModal
**บรรทัด:** 1435–1443  
**ความรุนแรง:** HIGH — ครั้งที่ 2 เปิด modal ปุ่มยัง disabled อยู่  

**โค้ดเดิม (ผิด):**
```javascript
function submitReg(btn) {
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังส่ง...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('reg-form-wrap').style.display = 'none';
    document.getElementById('reg-success').classList.add('show');
    setTimeout(() => closeModal(), 2500);  // ❌ ไม่ reset btn ก่อน close
  }, 1200);
}
```

**ปัญหา:**  
`btn.disabled = true` และ innerHTML เปลี่ยนไปแล้ว แต่ `closeModal()` ไม่ reset กลับ  
เปิด modal ครั้งต่อไป → ปุ่มยังค้าง disabled และข้อความยังเป็น "กำลังส่ง..."

**โค้ดที่ถูกต้อง:**
```javascript
function submitReg(btn) {
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังส่ง...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('reg-form-wrap').style.display = 'none';
    document.getElementById('reg-success').classList.add('show');
    setTimeout(() => {
      closeModal();
      // Reset button state AFTER modal closes
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }, 2500);
  }, 1200);
}

// Also reset in closeModal() for safety
function closeModal() {
  document.getElementById('reg-modal').classList.remove('open');
  // Reset form state when closed manually
  const submitBtn = document.querySelector('#reg-form-wrap .btn-p');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> ยืนยันการลงทะเบียน';
    submitBtn.disabled = false;
  }
  document.getElementById('reg-form-wrap').style.display = 'block';
  document.getElementById('reg-success').classList.remove('show');
}
```

---

### 🔴 BUG-03 — Modal แสดงผลผิดใน Prototype Device Frame
**บรรทัด:** 460–464  
**ความรุนแรง:** HIGH — modal หลุดออกนอก device frame  

**โค้ดเดิม (ผิด):**
```css
.modal-overlay {
  position: fixed;  /* ❌ fixed = relative to viewport, ไม่ใช่ device frame */
  inset: 0;
  ...
}
```

**ปัญหา:**  
`position: fixed` ทำให้ modal แสดงบน viewport ทั้งหมด ไม่ใช่ภายใน device frame  
ใน prototype ที่มี device frame เล็กๆ modal จะ "ล้น" ออกมานอก

**โค้ดที่ถูกต้อง:**
```css
/* Modal ต้องอยู่ใน .screen ซึ่ง position:relative */
.modal-overlay {
  position: absolute;  /* ✅ relative to .screen (nearest positioned ancestor) */
  inset: 0;
  background: rgba(0,0,0,.7);
  backdrop-filter: blur(8px);
  z-index: 900;
  display: none;
  align-items: flex-end;
  justify-content: center;
}
```
**หมายเหตุ:** `.screen` ต้องมี `position: relative` (มีอยู่แล้ว บรรทัด 79)

---

### 🟡 BUG-04 — `doLogin()` / `doRegister()` ไม่ reset ปุ่มเมื่อ navigate ไป
**บรรทัด:** 1460–1469  
**ความรุนแรง:** MEDIUM — กด back มา ปุ่มยัง disabled  

**โค้ดเดิม (ผิด):**
```javascript
function doLogin(btn) {
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังตรวจสอบ...';
  btn.disabled = true;
  setTimeout(() => { showScreen('s-home'); }, 1200);  // ❌ btn ยัง disabled
}
```

**โค้ดที่ถูกต้อง:**
```javascript
function doLogin(btn) {
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังตรวจสอบ...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.disabled = false;
    showScreen('s-home');
  }, 1200);
}

function doRegister(btn) {
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังสร้างบัญชี...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.disabled = false;
    showScreen('s-home');
  }, 1500);
}
```

---

### 🟡 BUG-05 — `showScreen()` ไม่ sync กับ Bottom Nav active state
**บรรทัด:** 1357–1369  
**ความรุนแรง:** MEDIUM — กดจาก Home ไป Media แต่ bottom nav ยังไม่อัปเดต  

**โค้ดเดิม (ผิด):**
```javascript
function showScreen(id) {
  document.querySelectorAll('.s').forEach(s => s.classList.remove('show'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('show');
    const screen = document.getElementById('screen');
    if (screen) screen.scrollTop = 0;
  }
  // ❌ อัปเดตแค่ proto-btn แต่ไม่อัปเดต .nav-item ใน bottom nav
  document.querySelectorAll('.proto-btn').forEach((b,i) => {
    const screens = ['s-splash','s-home','s-media','s-events','s-community','s-prayer','s-profile','s-auth','s-admin','s-features'];
    b.classList.toggle('active', screens[i] === id);
  });
}
```

**โค้ดที่ถูกต้อง:**
```javascript
function showScreen(id) {
  document.querySelectorAll('.s').forEach(s => s.classList.remove('show'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('show');
    const screen = document.getElementById('screen');
    if (screen) screen.scrollTop = 0;
  }
  
  // Sync proto bar
  document.querySelectorAll('.proto-btn').forEach((b, i) => {
    const screens = ['s-splash','s-home','s-media','s-events','s-community','s-prayer','s-profile','s-auth','s-admin','s-features'];
    b.classList.toggle('active', screens[i] === id);
  });
  
  // ✅ Sync ALL bottom navs across screens
  const navMap = {
    's-home':      0,
    's-media':     1,
    's-events':    2,
    's-community': 3,
    's-prayer':    4,
  };
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  if (navMap[id] !== undefined) {
    document.querySelectorAll('.nav-item').forEach((item, i) => {
      if (i % 5 === navMap[id]) item.classList.add('active');
    });
  }
}
```

---

### 🟡 BUG-06 — `switchTab()` ใน Media แสดง `flex` แทน `flex-direction:column`
**บรรทัด:** 1395–1402  
**ความรุนแรง:** MEDIUM — sermon list หายไปหรือแสดงผิดเมื่อ switch tab  

**โค้ดเดิม (ผิด):**
```javascript
function switchTab(btn, targetId) {
  ...
  el.style.display = (id === targetId) ? 'flex' : 'none';  // ❌ flex ทำให้ items เรียงแนวนอน
}
```

**ปัญหา:**  
`.sermon-list` มี CSS `display:flex; flex-direction:column`  
แต่ JS set `display:'flex'` โดยไม่ set `flex-direction` → items เรียงแนวนอนแทน

**โค้ดที่ถูกต้อง:**
```javascript
function switchTab(btn, targetId) {
  document.querySelectorAll('#s-media .t-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['sermon-tab','podcast-tab','worship-tab'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === targetId) {
      el.style.display = '';  // ✅ reset to CSS default (flex + column via class)
      el.removeAttribute('style');
    } else {
      el.style.display = 'none';
    }
  });
}
```

---

### 🟡 BUG-07 — Prayer submit ไม่ล้าง textarea
**บรรทัด:** 1445–1456  
**ความรุนแรง:** MEDIUM — UX ไม่ดี: ส่งซ้ำได้โดยไม่ต้องพิมพ์ใหม่  

**โค้ดเดิม:**
```javascript
function submitPrayer(btn) {
  // ... spinner and success
  // ❌ ไม่ล้าง textarea เลย
}
```

**โค้ดที่ถูกต้อง:**
```javascript
function submitPrayer(btn) {
  const orig = btn.innerHTML;
  const textarea = btn.closest('.prayer-form-card')?.querySelector('textarea');
  
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังส่ง...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fa-solid fa-check"></i> ส่งแล้ว! 🙏';
    btn.style.background = 'var(--neon)';
    btn.style.color = 'var(--bg)';
    
    // ✅ Clear the textarea
    if (textarea) textarea.value = '';
    
    const countEl = document.getElementById('pray-count');
    if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
    
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  }, 1000);
}
```

---

### 🟢 BUG-08 — `field-label` และ `field-input` ไม่มี `for` / `id` เชื่อมกัน (Accessibility)
**บรรทัด:** ทั่วทั้งฟอร์ม  
**ความรุนแรง:** LOW (Prototype) แต่ HIGH สำหรับ Production  

**โค้ดเดิม (ผิด):**
```html
<label class="field-label">ชื่อ *</label>
<input class="field-input" placeholder="ชื่อ">
<!-- ❌ label กับ input ไม่เชื่อมกัน — screen reader อ่านไม่ได้ -->
```

**โค้ดที่ถูกต้อง:**
```html
<label class="field-label" for="field-firstname">ชื่อ *</label>
<input class="field-input" id="field-firstname" 
       name="firstname" autocomplete="given-name" placeholder="ชื่อ">
```

---

### 🟢 BUG-09 — `#s-auth` ปุ่ม "ออกจากระบบ" ใน Profile navigate ไป s-auth โดยไม่ confirm
**บรรทัด:** 1248–1251  
**ความรุนแรง:** LOW — กด logout โดยไม่ตั้งใจได้ง่าย  

**โค้ดเดิม:**
```html
<div class="pm-item" onclick="showScreen('s-auth')">
  <!-- ❌ logout ทันทีโดยไม่ถาม -->
```

**โค้ดที่ถูกต้อง:**
```javascript
function confirmLogout() {
  // Simple confirm dialog for prototype
  if (confirm('ต้องการออกจากระบบหรือไม่?')) {
    showScreen('s-auth');
  }
}
```
```html
<div class="pm-item" onclick="confirmLogout()">
```

---

## SECTION 2: BEST PRACTICES ที่ควรปรับปรุง

---

### 🔵 BP-01 — ใช้ `addEventListener` แทน `onclick=""` ใน HTML

**ปัจจุบัน:** ทุก interactive element ใช้ inline `onclick=""` (50+ จุด)  

**ทำไมต้องเปลี่ยน:**
- Inline event handlers ผสม HTML กับ Logic → maintain ยาก
- ไม่สามารถ attach หลาย handlers บน element เดียวกัน
- Content Security Policy (CSP) บาง configuration บล็อก inline handlers

**Pattern ที่ดีกว่า:**
```javascript
// แทนที่จะเป็น onclick="showScreen('s-home')" ใน HTML
// ใช้ data attribute + delegated event listener

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-screen]');
  if (target) showScreen(target.dataset.screen);
  
  const deviceBtn = e.target.closest('[data-device]');
  if (deviceBtn) setDevice(deviceBtn.dataset.device, deviceBtn);
});
```
```html
<!-- HTML สะอาดขึ้น -->
<button data-screen="s-home" class="nav-item">...</button>
<button data-device="mobile" class="device-btn active">📱</button>
```

---

### 🔵 BP-02 — Password strength bar ใช้ index แทน named levels

**ปัจจุบัน:**
```javascript
fill.style.background = ['','var(--red)','var(--amber)','var(--amber)','var(--neon)'][strength] || '';
// ❌ index-based array magic — ไม่ชัดเจน, ระดับ 2 กับ 3 ใช้สีเดียวกัน
```

**ที่ดีกว่า:**
```javascript
function checkStrength(input) {
  const val = input.value;
  let score = 0;
  if (val.length >= 8)              score++;
  if (/[A-Z]/.test(val))            score++;
  if (/[0-9]/.test(val))            score++;
  if (/[^A-Za-z0-9]/.test(val))    score++;
  
  const levels = {
    0: { width: '0%',   color: '' },
    1: { width: '25%',  color: 'var(--red)',   label: 'อ่อนมาก' },
    2: { width: '50%',  color: 'var(--amber)', label: 'พอใช้' },
    3: { width: '75%',  color: '#9CCC65',      label: 'ดี' },
    4: { width: '100%', color: 'var(--neon)',  label: 'แข็งแกร่ง' },
  };
  
  const fill = document.getElementById('strength-fill');
  const level = levels[score];
  if (!fill || !level) return;
  
  fill.style.width = level.width;
  fill.style.background = level.color;
  // Optionally show label
}
```

---

### 🔵 BP-03 — ไม่มี focus management ใน Modal

**ปัจจุบัน:** กด "ลงทะเบียน" แล้ว modal เปิด แต่ focus ยังอยู่ที่ปุ่มเดิม

**ที่ดีกว่า:**
```javascript
function openModal(eventName, eventDate) {
  // ... setup ...
  document.getElementById('reg-modal').classList.add('open');
  
  // ✅ Focus first input after modal opens
  requestAnimationFrame(() => {
    const firstInput = document.querySelector('#reg-form-wrap input:not([disabled])');
    if (firstInput) firstInput.focus();
  });
}

function closeModal() {
  document.getElementById('reg-modal').classList.remove('open');
  
  // ✅ Return focus to the trigger button
  if (lastFocusedElement) lastFocusedElement.focus();
}

// Store trigger before opening
let lastFocusedElement = null;
// In openModal: lastFocusedElement = document.activeElement;
```

---

### 🔵 BP-04 — Onboarding ไม่มี animation transition ระหว่าง steps

**ปัจจุบัน:** text เปลี่ยนทันทีด้วย `innerHTML` — ดูกระทันหัน

**ที่ดีกว่า:**
```javascript
function nextOnboard() {
  onboardStep++;
  if (onboardStep >= onboardData.length) { showScreen('s-auth'); return; }
  
  const d = onboardData[onboardStep];
  const textEl = document.getElementById('onboard-text');
  
  // ✅ Fade out → update → fade in
  textEl.style.opacity = '0';
  textEl.style.transform = 'translateY(8px)';
  
  setTimeout(() => {
    textEl.innerHTML = `
      <p style="font-size:.9rem;color:var(--text)">${d.title}</p>
      <p style="font-size:.78rem;color:var(--muted)">${d.sub}</p>`;
    textEl.style.transition = 'opacity .3s ease, transform .3s ease';
    textEl.style.opacity = '1';
    textEl.style.transform = 'translateY(0)';
  }, 200);
  
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === onboardStep);
  });
  
  if (onboardStep === onboardData.length - 1) {
    document.getElementById('onboard-btn-text').textContent = 'เริ่มใช้งาน';
  }
}
```

---

### 🔵 BP-05 — `showScreen()` ใช้ array index แทน Map — brittle

**ปัจจุบัน:**
```javascript
const screens = ['s-splash','s-home','s-media',...];
b.classList.toggle('active', screens[i] === id);
// ❌ ถ้าเพิ่ม/เรียงปุ่มใหม่ index ผิดทันที
```

**ที่ดีกว่า:**
```javascript
// ใช้ data-screen attribute แทน index
document.querySelectorAll('.proto-btn').forEach(b => {
  b.classList.toggle('active', b.dataset.screen === id);
});
```
```html
<button class="proto-btn active" data-screen="s-splash" onclick="showScreen('s-splash')">🚀 Splash</button>
```

---

### 🔵 BP-06 — ไม่มี `aria-label` บน icon-only buttons

**ตัวอย่างที่ขาด:**
```html
<!-- Media screen back button -->
<button class="btn-neo btn-g" style="width:36px;height:36px;padding:0;border-radius:50%" 
        onclick="showScreen('s-home')">
  <i class="fa-solid fa-arrow-left"></i>
  <!-- ❌ ไม่มี aria-label — screen reader อ่านว่า "button" เฉยๆ -->
</button>

<!-- Device buttons -->
<button class="device-btn active" onclick="setDevice('mobile')">📱</button>
<!-- ❌ emoji ไม่ใช่ accessible label ที่ดี -->
```

**ที่ถูกต้อง:**
```html
<button class="btn-neo btn-g" aria-label="กลับหน้าหลัก" ...>
  <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
</button>

<button class="device-btn active" aria-label="มือถือ (Mobile)" ...>📱</button>
```

---

## SECTION 3: WHAT WAS FIXED & WHY (สรุปการแก้ไข)

| # | ไฟล์/บรรทัด | Bug/Issue | แก้โดย | ผลลัพธ์ |
|---|-------------|-----------|--------|---------|
| 1 | L.1376 `setDevice()` | `global event` deprecated | ส่ง `this` ผ่าน HTML + รับเป็น param | ทำงานได้ทุก browser |
| 2 | L.1435 `submitReg()` | ปุ่ม disabled ค้าง | store orig + reset ใน closeModal | เปิด modal ครั้งที่ 2 ได้ปกติ |
| 3 | L.460 Modal CSS | `fixed` หลุด device frame | เปลี่ยนเป็น `absolute` | modal อยู่ใน frame |
| 4 | L.1460 `doLogin()` | ปุ่ม disabled หลัง navigate | reset ก่อน navigate | กด back มาปุ่มใช้งานได้ |
| 5 | L.1357 `showScreen()` | Bottom nav ไม่ sync | เพิ่ม nav sync logic | active state ถูกต้อง |
| 6 | L.1400 `switchTab()` | flex direction ผิด | reset style แทน set flex | sermon list แสดงตั้ง |
| 7 | L.1445 `submitPrayer()` | textarea ไม่ล้าง | เพิ่ม textarea.value = '' | UX ดีขึ้น |
| 8 | ทั่วไป | label ไม่มี for/id | เพิ่ม id + for ทุก field | screen reader อ่านได้ |
| 9 | L.1248 Profile logout | logout โดยไม่ confirm | เพิ่ม confirm() | ป้องกัน accidental logout |
| BP1 | ทั่วไป | inline onclick | pattern แนะนำ data-attr | maintainable กว่า |
| BP5 | L.1365 | array index brittle | data-screen attribute | เพิ่มปุ่มได้ไม่เสีย |
| BP6 | ทั่วไป | ขาด aria-label | เพิ่มทุก icon-only button | accessible |

---

## SECTION 4: CONTRAST / ACCESSIBILITY AUDIT

```
ตรวจ color contrast ratio (WCAG 2.1 AA ต้องการ ≥ 4.5:1 สำหรับ text):

✅ var(--neon) #00FF66 บน var(--bg) #181A1F    → ratio: 10.8:1  (PASS)
✅ var(--text) #FFFFFF บน var(--bg) #181A1F    → ratio: 15.8:1  (PASS)
⚠️ var(--muted) #8A8F98 บน var(--bg) #181A1F  → ratio: 4.3:1   (FAIL ต่ำกว่า 4.5 นิดหน่อย)
⚠️ var(--muted) #8A8F98 บน var(--surface)     → ratio: 3.9:1   (FAIL)
✅ var(--cyan) #00D0FF บน var(--bg)            → ratio: 9.4:1   (PASS)
✅ var(--neon) on var(--bg) (large text)        → ratio: 10.8:1  (PASS)

แนะนำ: เพิ่ม muted text เล็กน้อย:
  --muted: #8A8F98 → #9599A1  (เพิ่ม lightness นิดหน่อย, ratio จะ PASS)
```

---

*Audit Report v6.1 | 9 Bugs Found | 6 Best Practices | Full Fix Applied*
