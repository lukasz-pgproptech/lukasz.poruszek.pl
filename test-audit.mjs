import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import workerModule, { generateInvoiceHtml, escapeHtml } from './workers/api/src/index.js';
import { generateInvoiceHtml as generateKsefInvoiceHtml, escapeHtml as escapeKsefHtml } from './ksef-client.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log('=== TEST SUITE 1: workers/api/src/index.js ===');

// 1. escapeHtml
const dangerousStr = `<script>alert("XSS & attack")</script>`;
const escaped = escapeHtml(dangerousStr);
assert(
  !escaped.includes('<script>') && escaped.includes('&lt;script&gt;') && escaped.includes('&quot;XSS &amp; attack&quot;'),
  'escapeHtml properly escapes <, >, ", and &'
);

// 2. generateInvoiceHtml
const dummyInvoice = {
  invoiceNumber: 'LP/2026/12/001',
  issueDate: '2026-12-01',
  dueDate: '2026-12-02',
  seller: {
    nip: '7963033913',
    name: 'POLSKA GRUPA PROPTECH SP. Z O.O.',
    street: 'ul. Jacka Malczewskiego 29',
    postalCode: '26-600',
    city: 'Radom',
    bankAccount: '46 1140 2004 0000 3902 8547 5429',
    rawAccount: '46114020040000390285475429'
  },
  buyer: {
    name: 'Jan Testowy',
    companyName: '<img src=x onerror=alert(1)> Firma Sp. z o.o.',
    nip: '1234567890',
    street: 'ul. Testowa 1',
    postalCode: '00-001',
    city: 'Warszawa',
    email: 'jan@test.pl'
  },
  items: [
    {
      name: 'Warsztaty AI <evil>',
      description: 'Opis <payload>',
      quantity: 1,
      unit: 'usł.',
      unitPriceNet: 975.61,
      netAmount: 975.61,
      vatRate: 23,
      vatAmount: 224.39,
      grossAmount: 1200.00
    }
  ],
  totalNet: 975.61,
  totalVat: 224.39,
  totalGross: 1200.00,
  paymentMethod: 'Przelew bankowy',
  transferTitle: 'Warsztaty AI LP/2026/12/001'
};

const htmlOutput = generateInvoiceHtml(dummyInvoice);
assert(htmlOutput.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0">'), 'generateInvoiceHtml has viewport meta tag');
assert(!htmlOutput.includes('<img src=x onerror=alert(1)>'), 'generateInvoiceHtml sanitizes XSS in buyer company name');
assert(htmlOutput.includes('&lt;img src=x onerror=alert(1)&gt;'), 'generateInvoiceHtml properly entity-escapes XSS payload');
assert(!htmlOutput.includes('<evil>'), 'generateInvoiceHtml sanitizes item name');
assert(htmlOutput.includes('table-container'), 'generateInvoiceHtml has responsive table-container');
assert(htmlOutput.includes('@media (max-width: 640px)'), 'generateInvoiceHtml has responsive mobile CSS media query');

// 3. Worker fetch router tests
async function testWorkerEndpoints() {
  const mockEnv = {
    RESERVATIONS: {
      async get(key) { return null; },
      async put(key, val) { return true; }
    }
  };

  // GET /api/payment-config
  const reqPaymentCfg = new Request('https://lukasz.poruszek.pl/api/payment-config', { method: 'GET' });
  const resPaymentCfg = await workerModule.fetch(reqPaymentCfg, mockEnv);
  const dataPaymentCfg = await resPaymentCfg.json();
  assert(resPaymentCfg.status === 200 && dataPaymentCfg.success === true && dataPaymentCfg.mode === 'bank_transfer', 'GET /api/payment-config returns mode bank_transfer');

  // GET /api/nip-lookup routing validation
  const reqNipBad = new Request('https://lukasz.poruszek.pl/api/nip-lookup?nip=123', { method: 'GET' });
  const resNipBad = await workerModule.fetch(reqNipBad, mockEnv);
  assert(resNipBad.status === 400, 'GET /api/nip-lookup?nip=123 validates 10 digits and returns 400 for short NIP');

  const reqNipPathBad = new Request('https://lukasz.poruszek.pl/api/nip/123', { method: 'GET' });
  const resNipPathBad = await workerModule.fetch(reqNipPathBad, mockEnv);
  assert(resNipPathBad.status === 400, 'GET /api/nip/123 validates 10 digits and returns 400 for short NIP');

  // POST /api/reserve-workshop contract check
  const reqWs = new Request('https://lukasz.poruszek.pl/api/reserve-workshop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Krzysztof Test',
      email: 'krzysztof@example.com',
      buyerType: 'individual'
    })
  });
  const resWs = await workerModule.fetch(reqWs, mockEnv);
  const dataWs = await resWs.json();
  assert(resWs.status === 200, 'POST /api/reserve-workshop returns 200 OK');
  assert(typeof dataWs.invoiceNumber === 'string' && dataWs.invoiceNumber.length > 0, 'POST /api/reserve-workshop has non-empty string invoiceNumber');
  assert(typeof dataWs.invoiceUrl === 'string' && dataWs.invoiceUrl.startsWith('/api/invoices/'), 'POST /api/reserve-workshop has invoiceUrl');
  assert(dataWs.transfer && typeof dataWs.transfer.accountFormatted === 'string' && dataWs.transfer.accountFormatted.includes('1140'), 'POST /api/reserve-workshop has transfer.accountFormatted');
  assert(dataWs.transfer && typeof dataWs.transfer.accountRaw === 'string' && dataWs.transfer.accountRaw.length === 26, 'POST /api/reserve-workshop has transfer.accountRaw (26 digits)');
  assert(dataWs.invoice && typeof dataWs.invoice.downloadUrl === 'string', 'POST /api/reserve-workshop has backward-compatible invoice.downloadUrl');

  // POST /api/reserve-mentoring contract check
  const reqMent = new Request('https://lukasz.poruszek.pl/api/reserve-mentoring', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Anna Test',
      email: 'anna@example.com',
      slotId: '2026-12-01_16:30',
      type: 'Mentoring biznesowy',
      date: '2026-12-01',
      time: '15:00',
      buyerType: 'individual'
    })
  });
  const resMent = await workerModule.fetch(reqMent, mockEnv);
  const dataMent = await resMent.json();
  assert(resMent.status === 200, 'POST /api/reserve-mentoring returns 200 OK');
  assert(typeof dataMent.invoiceNumber === 'string' && dataMent.invoiceNumber.length > 0, 'POST /api/reserve-mentoring has non-empty invoiceNumber');
  assert(typeof dataMent.invoiceUrl === 'string' && dataMent.invoiceUrl.startsWith('/api/invoices/'), 'POST /api/reserve-mentoring has invoiceUrl');
  assert(dataMent.transfer && typeof dataMent.transfer.accountFormatted === 'string', 'POST /api/reserve-mentoring has transfer.accountFormatted');
  assert(dataMent.transfer && typeof dataMent.transfer.accountRaw === 'string', 'POST /api/reserve-mentoring has transfer.accountRaw');
}

await testWorkerEndpoints();

console.log('\n=== TEST SUITE 2: booking-widget.css ===');
const bookingCss = fs.readFileSync(path.join(__dirname, 'booking-widget.css'), 'utf-8');
assert(bookingCss.includes('.menu__navList') && bookingCss.includes('.menu__navListItem') && bookingCss.includes('display: none !important'), 'booking-widget.css hides .menu__navList with display: none !important');
assert(bookingCss.includes('.cortevaLogo') && bookingCss.includes('.legal__cortevaLogo'), 'booking-widget.css hides Corteva logos');
assert(bookingCss.includes('.booking-close-btn') && !bookingCss.includes('.booking-close-btn {\n    display: none !important'), 'booking-widget.css does NOT hide .booking-close-btn');
assert(bookingCss.includes('min-width: 44px') && bookingCss.includes('min-height: 44px'), 'booking-widget.css sets close button min 44x44px');
assert(bookingCss.includes('margin: 10px 58px 6px 12px;'), 'booking-widget.css reserves 58px right clearance for close button on mobile');
assert(bookingCss.includes('padding: 16px 64px 0 28px;'), 'booking-widget.css reserves right clearance on desktop');
assert(bookingCss.includes('.menuBtn') && bookingCss.includes('min-width: 48px !important') && bookingCss.includes('min-height: 48px !important'), 'booking-widget.css sets .menuBtn min 48x48px');
assert(bookingCss.includes('.cal-nav-btn') && bookingCss.includes('min-width: 44px !important'), 'booking-widget.css sets .cal-nav-btn min 44x44px on mobile');
assert(bookingCss.includes('font-size: 16px !important'), 'booking-widget.css enforces font-size: 16px !important on inputs to prevent iOS auto-zoom');
assert(bookingCss.includes('max-height: calc(100dvh - 20px)') || bookingCss.includes('max-height: calc(100dvh - 24px)'), 'booking-widget.css sets dynamic max-height: calc(100dvh - 20px)');
assert(bookingCss.includes('height: 44px') && bookingCss.includes('max-height: 44px') && bookingCss.includes('.event-type-selector'), 'booking-widget.css sets .event-type-selector height: 44px segmented control');

console.log('\n=== TEST SUITE 3: products-view.css ===');
const productsCss = fs.readFileSync(path.join(__dirname, 'products-view.css'), 'utf-8');
assert(productsCss.includes('.menu__navList') && productsCss.includes('display: none !important'), 'products-view.css hides .menu__navList with display: none !important');
assert(productsCss.includes('#products-view-container:not(.is-active)') && productsCss.includes('opacity: 0 !important'), 'products-view.css strictly enforces opacity 0 !important on inactive container');
assert(productsCss.includes('.roadmap-node') && productsCss.includes('min-width: 44px !important'), 'products-view.css sets roadmap-node touch target to min 44px');
assert(!productsCss.includes('.editorial-booking-cta'), 'products-view.css has removed redundant .editorial-booking-cta');

console.log('\n=== TEST SUITE 4: index.html & index.3d.html ===');
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
assert(indexHtml.includes('<button class="booking-close-btn" id="bookingCloseBtn"'), 'index.html contains #bookingCloseBtn');
assert(indexHtml.includes('viewport-fit=cover'), 'index.html includes viewport-fit=cover in viewport meta tag');
assert(!indexHtml.includes('From start to finish, it’s corn seed development'), 'index.html has zero corn seed template references');
assert(!indexHtml.includes('editorialBookingCta'), 'index.html has zero redundant editorial CTA buttons');
assert(indexHtml.includes('label-short') && indexHtml.includes('label-full'), 'index.html has label-short and label-full spans for responsive segmented buttons');
assert(indexHtml.includes('Twoja przeglądarka ma wyłączoną akcelerację 3D (WebGL).'), 'index.html has Polish unsupported fallback message');

const index3dHtml = fs.readFileSync(path.join(__dirname, 'index.3d.html'), 'utf-8');
assert(!index3dHtml.includes('From start to finish, it’s corn seed development'), 'index.3d.html has zero corn seed references');
assert(!index3dHtml.includes('editorialBookingCta'), 'index.3d.html has zero redundant editorial CTA buttons');
assert(index3dHtml.includes('bookingCloseBtn'), 'index.3d.html contains bookingCloseBtn');

console.log('\n=== TEST SUITE 5: booking-widget.js & products-view.js ===');
const bookingJs = fs.readFileSync(path.join(__dirname, 'booking-widget.js'), 'utf-8');
assert(bookingJs.includes("text === 'undefined'"), 'booking-widget.js guards copyTransferText against copying "undefined"');
assert(bookingJs.includes('/api/propose-slot'), 'booking-widget.js redirects proposal to /api/propose-slot');
assert(bookingJs.includes('window.is3DRenderingPaused = false'), 'booking-widget.js keeps 3D rendering active during modal');
assert(!bookingJs.includes('window.is3DRenderingPaused = true'), 'booking-widget.js does not freeze 3D rendering');
assert(bookingJs.includes('data.amountPln'), 'booking-widget.js includes data.amountPln fallback in amountFormatted');
assert(bookingJs.includes('escapeHtml(name)'), 'booking-widget.js escapes name in Step 3 innerHTML');

const productsJs = fs.readFileSync(path.join(__dirname, 'products-view.js'), 'utf-8');
assert(productsJs.includes("container.style.opacity = '0'") && productsJs.includes("container.style.visibility = 'hidden'"), 'products-view.js enforces inline style deactivation in setSectionState(false)');
assert(productsJs.includes("currentSubSection === 'data'"), 'products-view.js checks currentSubSection === data for Scene 2 activation');
assert(productsJs.includes("currentSubSection === 'dna'"), 'products-view.js checks currentSubSection === dna for Scene 1 deactivation');
assert(productsJs.includes('Math.round(-0.28 * window.innerHeight)'), 'products-view.js uses relative targetY for 3D hotspot on mobile');

console.log('\n=== TEST SUITE 6: main.76ceb4644b28bd9c30b5.js (Pioneer 3D Engine) ===');
const mainJs = fs.readFileSync(path.join(__dirname, 'main.76ceb4644b28bd9c30b5.js'), 'utf8');
assert(!mainJs.includes('if(window.is3DRenderingPaused)return;'), 'main bundle onRender does not freeze background 3D animations');
assert(mainJs.includes('n.width>0&&n.height>0&&(e.renderer.setRenderTarget(n),e.renderer.clear())'), 'main bundle guards zero-sized framebuffers against 6x GL_INVALID_FRAMEBUFFER_OPERATION');
assert(mainJs.includes('window.swipeHandler=this,window.getSnapPos=J'), 'SwipeHandler exposes window.swipeHandler and window.getSnapPos on mobile');
assert(!mainJs.includes('SwipeHandler.getSnapPosition() - Can\'t find section with name'), 'SwipeHandler.getSnapPosition safely handles missing sections without throwing');
assert(!mainJs.includes('ScrollHandler.getSnapPosition() - Can\'t find section with name'), 'ScrollHandler.getSnapPosition safely handles missing sections without throwing');
assert(!mainJs.includes('https://www.corteva.us/california-privacy-rights.html'), 'main bundle Module 369 has zero California privacy rights Corteva links');
assert(!mainJs.includes('Visit Corn Revolution Podcast'), 'main bundle Module 369 has zero Corn Revolution podcast references');

console.log('\n=== TEST SUITE 7: server.mjs & ksef-client.mjs & email-service.mjs ===');
const serverMjs = fs.readFileSync(path.join(__dirname, 'server.mjs'), 'utf8');
assert(serverMjs.includes("reqPath === '/api/nip-lookup' || reqPath.startsWith('/api/nip/')"), 'server.mjs handles both /api/nip-lookup and /api/nip/:nip');
assert(serverMjs.includes("reqPath === '/api/propose-slot'"), 'server.mjs handles POST /api/propose-slot');
assert(serverMjs.includes('downloadUrl: `/api/invoices/${invoice.id}`'), 'server.mjs returns invoice.downloadUrl contract compatibility');
assert(serverMjs.includes('accountFormatted: formattedAccount') && serverMjs.includes('rawAccount: rawAccount'), 'server.mjs returns formatted and raw accounts');

const ksefClient = fs.readFileSync(path.join(__dirname, 'ksef-client.mjs'), 'utf8');
assert(ksefClient.includes('export function escapeHtml'), 'ksef-client.mjs exports escapeHtml');
assert(ksefClient.includes('escapeHtml(inv.buyer.companyName || inv.buyer.name)'), 'ksef-client.mjs escapes buyer name');
assert(ksefClient.includes('table-container'), 'ksef-client.mjs has responsive table-container');

// Test ksef-client.mjs escapeHtml
const ksefHtml = generateKsefInvoiceHtml({
  invoiceNumber: 'LP/2026/12/002',
  issueDate: '2026-12-01',
  saleDate: '2026-12-01',
  isProforma: true,
  seller: {
    nip: '7963033913',
    name: 'PG Proptech',
    street: 'ul. Malczewskiego 29',
    postalCode: '26-600',
    city: 'Radom',
    bankAccount: '46 1140 2004 0000 3902 8547 5429',
    regon: '123456789',
    krs: '0000123456'
  },
  buyer: {
    name: '<script>alert("hack")</script>',
    nip: '9998887766',
    street: '<img src=x onerror=1>',
    postalCode: '00-001',
    city: 'Warszawa',
    email: 'hacker@test.pl'
  },
  items: [{
    name: 'Usługa <evil>',
    quantity: 1,
    unitNetto: 100,
    vatRate: 23,
    vatAmount: 23,
    totalBrutto: 123
  }],
  totals: { netto: 100, vat: 23, brutto: 123 },
  paymentMethod: 'Przelew bankowy'
});
assert(!ksefHtml.includes('<script>alert("hack")</script>'), 'ksef-client.mjs sanitizes buyer script injection');
assert(!ksefHtml.includes('<img src=x onerror=1>'), 'ksef-client.mjs sanitizes buyer img tag');
assert(ksefHtml.includes('&lt;script&gt;'), 'ksef-client.mjs entity-escapes payload');

const emailService = fs.readFileSync(path.join(__dirname, 'email-service.mjs'), 'utf8');
assert(emailService.includes('escapeHtml(name)'), 'email-service.mjs escapes participant name');
assert(emailService.includes('escapeHtml(group)'), 'email-service.mjs escapes group name');
assert(emailService.includes('escapeHtml(email)'), 'email-service.mjs escapes waitlist email');

console.log('\n=== TEST SUITE 8: Edge Cases & Error Boundaries ===');
const mockEnvEdge = {
  RESERVATIONS: {
    async get(key) { return null; },
    async put(key, val) { return true; }
  }
};

// 1. Missing email in workshop
const reqWsNoEmail = new Request('https://lukasz.poruszek.pl/api/reserve-workshop', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Tylko Imie' })
});
const resWsNoEmail = await workerModule.fetch(reqWsNoEmail, mockEnvEdge);
assert(resWsNoEmail.status === 400, 'POST /api/reserve-workshop returns 400 when email is missing');

// 2. Missing name in workshop
const reqWsNoName = new Request('https://lukasz.poruszek.pl/api/reserve-workshop', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.pl' })
});
const resWsNoName = await workerModule.fetch(reqWsNoName, mockEnvEdge);
assert(resWsNoName.status === 400, 'POST /api/reserve-workshop returns 400 when name is missing');

// 3. Malformed JSON
const reqBadJson = new Request('https://lukasz.poruszek.pl/api/reserve-workshop', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: 'not a json'
});
const resBadJson = await workerModule.fetch(reqBadJson, mockEnvEdge);
assert(resBadJson.status === 400, 'POST /api/reserve-workshop handles malformed JSON and returns 400');

// 4. Missing email in propose-slot
const reqPropNoEmail = new Request('https://lukasz.poruszek.pl/api/propose-slot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ note: 'Chcę slot' })
});
const resPropNoEmail = await workerModule.fetch(reqPropNoEmail, mockEnvEdge);
assert(resPropNoEmail.status === 400, 'POST /api/propose-slot returns 400 when email is missing');

// 5. 100% discount coupon in workshop
const reqWs100 = new Request('https://lukasz.poruszek.pl/api/reserve-workshop', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'VIP User',
    email: 'vip@test.pl',
    coupon: '432834145'
  })
});
const resWs100 = await workerModule.fetch(reqWs100, mockEnvEdge);
const dataWs100 = await resWs100.json();
assert(dataWs100.amountPln === 0 && dataWs100.transfer.amount === 0, '100% coupon correctly computes 0 PLN final price');

// 6. 50% discount coupon in workshop
const reqWs50 = new Request('https://lukasz.poruszek.pl/api/reserve-workshop', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Promo User',
    email: 'promo@test.pl',
    coupon: 'CHORWACJA'
  })
});
const resWs50 = await workerModule.fetch(reqWs50, mockEnvEdge);
const dataWs50 = await resWs50.json();
assert(dataWs50.amountPln === 600 && dataWs50.transfer.amount === 600, '50% coupon correctly computes 600 PLN final price');

console.log('\n=== TEST SUITE 9: User Requests Verification (Schedule, Favicon, Gestures, UI) ===');

// 1. Workshop January Group Schedule
const bookingJsSuite9 = fs.readFileSync(path.join(__dirname, 'booking-widget.js'), 'utf-8');
assert(bookingJsSuite9.includes('12.01.2027') && !bookingJsSuite9.includes('05.01.2027'), 'booking-widget.js shifted January group start to 12.01.2027');
assert(bookingJsSuite9.includes('16 lutego 2027'), 'booking-widget.js January group ends on 16 lutego 2027 (no collision with Dec 5th Jan)');

const indexHtmlSuite9 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const index3dHtmlSuite9 = fs.readFileSync(path.join(__dirname, 'index.3d.html'), 'utf-8');
assert(indexHtmlSuite9.includes('start 12.01') && !indexHtmlSuite9.includes('start 05.01'), 'index.html displays January group start 12.01');
assert(index3dHtmlSuite9.includes('start 12.01') && !index3dHtmlSuite9.includes('start 05.01'), 'index.3d.html displays January group start 12.01');

// 2. Favicon
assert(fs.existsSync(path.join(__dirname, 'favicon.svg')), 'favicon.svg exists in workspace');
assert(fs.existsSync(path.join(__dirname, 'favicon.ico')), 'favicon.ico exists in workspace');
assert(fs.existsSync(path.join(__dirname, 'favicon/favicon-32x32.png')), 'favicon/favicon-32x32.png exists');
const favSvg = fs.readFileSync(path.join(__dirname, 'favicon.svg'), 'utf-8');
assert(favSvg.includes('ŁP'), 'favicon.svg contains ŁP monogram');
assert(indexHtmlSuite9.includes('/favicon.svg'), 'index.html links to /favicon.svg');
assert(index3dHtmlSuite9.includes('/favicon.svg'), 'index.3d.html links to /favicon.svg');

// 3. Progress Ring removal on mobile
const mainJsSuite9 = fs.readFileSync(path.join(__dirname, 'main.76ceb4644b28bd9c30b5.js'), 'utf-8');
assert(mainJsSuite9.includes('progressRing.object.visible=!1'), 'main bundle permanently hides progressRing');

// 4. Explore the Story removal
assert(mainJsSuite9.includes('"menu-headline":""'), 'main bundle clears "menu-headline" ("Explore the Story" removed)');

const bookingCssSuite9 = fs.readFileSync(path.join(__dirname, 'booking-widget.css'), 'utf-8');
const productsCssSuite9 = fs.readFileSync(path.join(__dirname, 'products-view.css'), 'utf-8');
assert(bookingCssSuite9.includes('.menu__header'), 'booking-widget.css hides .menu__header');
assert(productsCssSuite9.includes('.menu__header'), 'products-view.css hides .menu__header');

// 5. Hide hamburger button on mobile during modal
assert(bookingCssSuite9.includes('body.is-modal-open .menuBtn'), 'booking-widget.css hides .menuBtn when modal is open');

// 6. Mobile swipe handler on window & scene pointer events
assert(mainJsSuite9.includes('window.addEventListener("touchstart",this.onTouchStart'), 'main bundle attaches touchstart to window');
assert(productsCssSuite9.includes('.products-view-container') && productsCssSuite9.includes('pointer-events: none !important'), 'products-view.css frees pointer-events for mobile touch pass-through');

console.log(`\n========================================`);
console.log(`RESULT: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}
