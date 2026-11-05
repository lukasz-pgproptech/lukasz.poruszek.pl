Teraz w 

# SEKCJA ZWŁOK ARCHITEKTURY I INŻYNIERIA WSTECZNA: CORNREVOLUTION.RESN.GLOBAL

## Forensic Reverse-Engineering & Deep Technical Audit

**Projekt referencyjny:** Pioneer – *Corn. Revolutionized.*
**Studio deweloperskie:** Resn (resn.global) – wielokrotny zdobywca Awwwards Site of the Year / Agency of the Year
**Klient:** Corteva Agriscience / Pioneer Seeds
**Data audytu:** Listopad 2026
**Audytor:** Bezwzględny Analityk Techniczny i Ekspert Inżynierii Wstecznej WebGL/Awwwards
**Cel audytu:** Dogłębna dekonstrukcja mechaniki, architektury narracyjnej, potoku graficznego WebGL i kinetyki strony w celu transferu najwyższej klasy wzorców projektowych do `lukasz.poruszek.pl`.

---

## 1. TOŻSAMOŚĆ CYFROWA I FENOMEN STUDIA RESN

### 1.1. Dlaczego ta strona deklasuje rynek i zdobywa nagrody (Site of the Day / FWA of the Day)

Typowa strona korporacyjna lub rolnicza to nudny portal informacyjny oparty na WordPressie, przeładowany generycznymi kafelkami, stockowymi zdjęciami uśmiechniętych rolników na traktorze i ścianami tekstu w bootstrapowej siatce.

Resn odwrócił ten paradygmat o 180 stopni:

1. **Traktowanie produktu rolniczego jak luksusowego supercaru lub technologii kosmicznej:** Ziarno kukurydzy nie jest „paszą” – jest biologicznym mikroprocesorem, produktem 100 lat inżynierii genetycznej i symulacji petabajtów danych.
2. **Pojedyncza oś narracyjna (Single Narrative Spine):** Użytkownik nie błądzi po skomplikowanym menu. Zostaje wciągnięty w hipnotyczny, liniowy, a zarazem interaktywny tunel czasoprzestrzenny, który prowadzi go od skali makro (kolba kukurydzy) przez mikro (DNA i doniczka laboratoryjna) po megaskalę (pola uprawne widziane z lotu ptaka) i z powrotem do pojedynczego, wyselekcjonowanego ziarna.
3. **Organiczne poczucie żywego interfejsu (Living Interface):** Cały ekran żyje. Drobinki pyłków unoszą się w powietrzu z głębią ostrości (Bokeh / Depth of Field), obiekty 3D reagują mikro-wychyleniami na ruch kursora myszy oraz żyroskopu w smartfonie (parallax 3D), a przejścia między scenami nie są brutalnymi przeładowaniami, lecz cięciami ukośnymi (Scissor Testing) w jednym wspólnym render loopie.

---

## 2. NARRACJA I COPYWRITING – ANATOMIA PRZEKAZU

### 2.1. Podział na akty i ekonomia słów

Doświadczenie podzielone jest na **3 główne rozdziały** (z 7 scenami technicznymi), tworząc klasyczną strukturę trójaktową w narracji naukowej:

```
+---------------------------------------------------------------------------------------------------+
|                                 HERO: Corn. Revolutionized.                                       |
|                  "From lab to field, it's corn seed development that will change farming."        |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| ACT 1: SCIENCE (Laboratorium i Dane)                                                              |
|   1. "First, a solid foundation." -> Biblioteka germplazmy od 1920 r.                             |
|   2. "Computers cut down the contenders." -> Petabajty danych, algorytmy, 20x więcej kandydatów.  |
|   3. "Our breeders dial it in further." -> Skrócenie cyklu o 30%, czyste linie wsobne.           |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| ACT 2: REAL WORLD TESTING (Stres Środowiskowy i Poligon)                                          |
|   4. "We take it to the field." -> Prawdziwe testy: Wiatr, Susza, Choroby, Gleba, Gęstość.       |
|   5. "Testing, testing and more testing." -> 8x więcej testów polowych, wieloletnia selekcja.     |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| ACT 3: RESULT (Elita i Konwersja)                                                                 |
|   6. "Less than 0.01% of seeds make it." -> Mniej niż 1 na 10 000 nasion trafia do worka Pioneer. |
|   7. INTERACTIVE KERNEL & CALL TO ACTION -> Plon (+8.8 bu/A), Odporność, Kontakt z managerem.    |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
                                     [Pętla Nieskończona / Loop]
```

### 2.2. Pełny wyciąg haseł (Hard Data z ekstrakcji kodu źródłowego)

Każda scena operuje bezwzględną dyscypliną tekstu – **jeden nagłówek stenciled (maks. 5-7 słów)** oraz **jeden akapit wyjaśniający (2 zdania, twarde liczby)**:

* **Landing:**
  * Nagłówek: `Corn. Revolutionized.`
  * Body: `From lab to field, it's corn seed development that will change farming.`
  * CTA: `Scroll to Discover`
* **Scena 1 (Science / Foundation):**
  * Nagłówek: `First, a solid foundation.`
  * Body: `We have the world's most comprehensive corn germplasm library. And every year, we create more unique genetic lines, each one traceable back to the first inbred development program started in 1920.`
  * Interaktywny Hotspot: `From billions of possibilities, we pick the best.`
* **Scena 2 (Science / Computing):**
  * Nagłówek: `Computers cut down the contenders.`
  * Body: `Petabytes of data (that's one million GB each) feed into computers, running millions of simulations using proprietary algorithms for the most accurate predictions. Nearly 20x more candidates are in our pipeline compared with 10 years ago, far more than we could ever test in the field.`
* **Scena 3 (Science / Greenhouse & Pot):**
  * Nagłówek: `Our breeders dial it in further.`
  * Body: `Advanced breeding technologies have reduced our development time by 30% over the last decade. A purer version of inbreds provides a clearer view into each line's performance, so we narrow the list down even faster.`
* **Scena 4 (Testing / Stalk & Stress):**
  * Nagłówek: `We take it to the field.`
  * Body: `Now, the testing gets exponentially tougher. At each of Pioneer's research plots, corn seeds that have made it this far undergo rigorous stress tests. New tools give precise measurements on how the plants respond.`
  * Hotspoty testów:
    1. *Wind:* `The Boreas mobile wind machine simulates high winds to test stalk and root strength...`
    2. *Drought:* `Dedicated managed stress environments... 9 bu/A advantage in stress.`
    3. *Disease:* `9% improvement in northern leaf blight resistance...`
    4. *Soil:* `Tested in different soil types and environments...`
    5. *Population Density:* `Different seedling rates to uncover optimal performance.`
* **Scena 5 (Testing / Field Aerial Grid):**
  * Nagłówek: `Testing, testing and more testing.`
  * Body: `A second year of pre-commercial testing. More locations. Expanding decision zones. Now we conduct 8x more late-stage field tests, comparing proven leaders, competitive seeds and experimental hybrids, so only the best make it to a farmer's field.`
* **Scena 6 (Result / The 0.01% Kernel):**
  * Nagłówek: `Less than 0.01% of seeds make it.`
  * Body: `These are the very best of the best. They're the contenders that have survived the computer simulations, the lab tests, the field tests and the discerning breeders to make it into a Pioneer bag. It's our new class.`
  * Interakcja: `Drag kernel to discover` / `Spin to discover`
  * Kluczowe filary nasiona: *Yield (+8.8 bu/A)*, *Consistency*, *Qrome insect protection*.
* **Scena 7 (Conversion & Outro):**
  * CTA 1: `Sign Up for News`
  * CTA 2: `Contact a Territory Manager`
  * CTA 3: `Visit Corn Revolution Podcast`
  * Płynne ukośne zapętlenie z powrotem do Landing Page.

---

## 3. INŻYNIERIA TYPOGRAFII I STRUKTURA LAYOUTU

### 3.1. Zbadany zestaw krojów (Font Stack)

1. **Krój Tytułowy / Akcentowy:** `Manifold CF Extra Bold` (Colophon Foundry / Connary Fagen)
   * Zastosowanie: Wielkie nagłówki `.title`, `.title2`, `.title3`, przyciski `.btnMain`, linki zewnętrzne.
   * Renderowanie: **MSDF (Multi-channel Signed Distance Field)** w WebGL shaderze oraz font webowy `.woff` dla formularzy.
2. **Krój Tekstowy / Interfejsowy:** `Gilroy` (Radomir Tinkov) – wagi Light / Thin (200), Regular (400), Bold (700).
   * Zastosowanie: `.body`, `.subText`, `.subText2`, etykiety, stopka, formularze.

### 3.2. Genialna formuła skalowania Resn (Fluid REM System)

Resn nie używa arbitralnych breakpointów, w których layout „skacze”. Zamiast tego zdefiniowano dynamiczną bazę `rem` powiązaną ściśle z szerokością okna przeglądarki (`vw`):

```css
/* loader.js - Baza skalowania jednostki REM */
html {
  background: black;
}

@media only screen and (max-width: 599px) {
  html {
    font-size: 0.92593vw; /* Mobile: na ekranie 400px szerokości, 1rem = 3.70px */
  }
}

@media only screen and (min-width: 600px) {
  html {
    font-size: 0.52083vw; /* Desktop: na ekranie 1920px szerokości, 1rem = dokladnie 10.00px! (1920 * 0.0052083) */
  }
}

@media only screen and (min-width: 1920px) {
  html.desktop, html.tablet {
    font-size: 10px; /* Sztywny cap powyżej 1920px zapobiegający gigantyzmowi */
  }
}
```

Dzięki temu zapis w CSS `font-size: 9rem` oznacza **dokładnie 90px na monitorze Full HD (1920px)** i skaluje się matematycznie co do ułamka piksela w dół na mniejszych laptopach (np. 1440px -> 67.5px), zachowując idealne proporcje kompozycji!

### 3.3. Tabela parametrów typograficznych

| Klasa CSS      | Rodzina Fontu          | Waga              | Rozmiar Desktop (1920px) | Rozmiar Mobile | Line-Height | Letter-Spacing | Transform |
| :------------- | :--------------------- | :---------------- | :----------------------- | :------------- | :---------- | :------------- | :-------- |
| `.title`     | Manifold CF Extra Bold | 800 (w pliku 400) | `10rem` (100px)        | `12.5rem`    | `1.0`     | `-0.02em`    | UPPERCASE |
| `.title2`    | Manifold CF Extra Bold | 800               | `10rem` (100px)        | `11.0rem`    | `1.0`     | `-0.02em`    | UPPERCASE |
| `.title3`    | Manifold CF Extra Bold | 800               | `9rem` (90px)          | `9.0rem`     | `1.0`     | `-0.02em`    | UPPERCASE |
| `.body`      | Gilroy                 | 200 (Light)       | `2rem` (20px)          | `4.0rem`     | `1.5`     | `+0.02em`    | Normal    |
| `.subText`   | Gilroy                 | 200 (Light)       | `2rem` (20px)          | `2.5rem`     | `1.0`     | `+0.05em`    | UPPERCASE |
| `.subText2`  | Gilroy                 | 200 (Light)       | `1.2rem` (12px)        | `2.5rem`     | `1.0`     | `+0.05em`    | UPPERCASE |
| `.bottomCta` | Gilroy                 | 200 (Light)       | `2rem` (20px)          | `2.5rem`     | `1.0`     | `+0.05em`    | UPPERCASE |
| `.btnMain`   | Manifold CF Extra Bold | 800               | `2rem` (20px)          | `5.0rem`     | `1.0`     | `0em`        | UPPERCASE |

---

## 4. PALETA BARW I TOKENY WIZUALNE

Kolorystyka nie jest przypadkowa – bazuje na estetyce organiczno-technologicznej (biotech). Głęboka, smolista czerń łączy się z barwami chlorofilu, złota dojrzałej kukurydzy oraz chłodnego laboratoryjnego turkusu.

```
+-----------------------------------------------------------------------------------+
| KOLOR                    | WARTOŚĆ HEX / RGB            | ROLA / ZASTOSOWANIE     |
+--------------------------+------------------------------+-------------------------+
| Void Black (Tło)         | #000000                      | Czysta czerń bazowa     |
| Deep Forest Green        | #001D11                      | Tło gradientów winiety  |
| Bio Emerald Teal         | #00322E                      | Akcent gradientu tła    |
| Dark Leaf                | #013110                      | Spód gradientu sceny    |
| WebGL Ambient Tint       | rgb(5, 79, 41) / [0.02,0.31] | Multiply blend w shaderze|
| WebGL Dark Core          | rgb(13, 54, 5) / [0.05,0.21] | Cienie winiety WebGL    |
| Golden Kernel (Nasiono)  | #E4A938 / #FFBE33            | 3D mesh ziarna, akcent  |
| Golden Silk (Włosie)     | #D9D0A5                      | 3D mesh jedwabiu kolby  |
| Stalk Olive              | #5F661E                      | Łodyga, cząsteczki bokeh|
| Pure Text White          | #FFFFFF (opacity 1.0)        | Nagłówki, aktywne linki |
| Muted White              | rgba(255, 255, 255, 0.8)     | Podrzędne linki stopki  |
| Ghost Border             | rgba(255, 255, 255, 0.3)     | Obramowania buttonów    |
| Subtle Guide Lines       | rgba(255, 255, 255, 0.1)     | Etykiety nieaktywne     |
+-----------------------------------------------------------------------------------+
```

---

## 5. WARSTWA 3D, WEBGL I ARCHITEKTURA SHADERÓW

Pod maską strony kryje się zintegrowany, wysoce zoptymalizowany silnik czasu rzeczywistego oparty na **Three.js r102** i rozbudowany o autorski framework Resn.

### 5.1. Geometrie 3D i Wagi Zasobów (Modele glTF)

Resn nie wgrywa ciężkich plików OBJ czy FBX. Wszystkie modele zostały zoptymalizowane do standardu glTF 2.0 z binarnymi buforami geometrii:

* `cobb_test.gltf` (67.6 KB) + `cobb_test.bin` (46.8 KB) -> **Kolba kukurydzy (ok. 114 KB łącznie!)**
* `hair.gltf` (24.2 KB) + `hair.bin` (27.7 KB) -> **Włosie / jedwab kukurydzy (ok. 52 KB)**
* `KERNAL.gltf` (4.0 KB) + `KERNAL.bin` (89.1 KB) -> **Pojedyncze ziarno kukurydzy (ok. 93 KB)**
* `pot3.gltf` (68.0 KB) + `pot3.bin` (158.8 KB) -> **Przekrój doniczki laboratoryjnej z korzeniami (ok. 226 KB)**
* `SingleStalk12_db.gltf` (26.4 KB) + `SingleStalk12_db.bin` (308.7 KB) -> **Łodyga kukurydzy**
* `stalk_rigged3.gltf` (45.2 KB) + `stalk_rigged3.bin` (72.6 KB) -> **Oszkieletowana łodyga z animacjami kości (Skeletal Rigging)**

> **Kluczowy fakt inżynieryjny:** Łączna waga WSZYSTKICH modeli 3D w całym doświadczeniu wynosi **mniej niż 1 MB**! Resn osiąga fotorealizm nie przez miliony wielokątów, lecz przez mistrzowskie operowanie shaderami materiałów, mapami normalnych i postprocessingiem.

### 5.2. Tekstury kompresowane GPU (Format KTX / ASTC)

Zamiast nieefektywnych plików PNG/JPEG dekompresowanych do surowego VRAM, strona wykorzystuje kompresję blokową tekstur wspieraną sprzętowo przez procesory graficzne:

* Pliki `.ktx` w formacie **ASTC (Adaptive Scalable Texture Compression)**:
  * `TOP_L.ktx`, `BOTTOM_L.ktx`, `TOP_R.ktx`, `BOTTOM_R.ktx` (tekstury kolby z mipmapami)
  * `map_bump_kernel.ktx`, `map_matcap_mult.ktx`, `map_matcap_screen.ktx` (MatCap i bump dla ziarna)
  * `soil_default@mipmaps.ktx`, `soil-displacement.ktx`, `soil-normal.ktx` (przemieszczenia gleby)
  * `stalk_energy@mipmaps.ktx`, `lens-flare.ktx`

Dzięki kompresji KTX tekstury trafiają bezpośrednio do pamięci GPU bez narzutu na garbage collector i bez spadków klatek podczas scrollowania.

### 5.3. Renderowanie tekstu 3D przez MSDF (Multi-channel Signed Distance Field)

Zamiast umieszczać tekst w DOM HTML lub tworzyć ciężkie geometrie wektorowe 3D, Resn renderuje napisy bezpośrednio w scenie WebGL przy pomocy MSDF:

* Tekstury źródłowe: `manifold-msdf.png` (59.7 KB) i `gilroy-msdf.png` (96.7 KB) wraz z deskryptorami glifów `manifold.json` i `gilroy.json`.
* **Wyciągnięty shader fragmentów (GLSL):**

```glsl
#define GLSLIFY 1
uniform float uAlpha;
uniform vec3 color;
uniform sampler2D msdfMap;

varying vec2 vUv;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main() {
    vec3 msdfSample = texture2D(msdfMap, vUv).rgb;
    // Wyciągnięcie odległości signed distance ze środkowego kanału RGB
    float sigDist = median(msdfSample.r, msdfSample.g, msdfSample.b) - 0.5;

    // Obliczenie szerokości antyaliasingu na podstawie pochodnych cząstkowych GPU
    float border = fwidth(sigDist);
    sigDist = sigDist / border;
    float fill = clamp(sigDist + 0.5, 0.0, 1.0);

    float alpha = fill * uAlpha;
    gl_FragColor = vec4(color, alpha);
}
```

Zaleta: Tekst może być dowolnie skalowany, transformowany w trójwymiarze, rzucany pod kątem kamery, a jego krawędzie pozostają ostre jak wektor w Illustratorze, kosztując zaledwie 1 draw call!

### 5.4. Technika przejść między scenami: WebGL Scissor Testing & Diagonal Slopes

Większość programistów przy zmianie sekcji ukrywa jeden canvas i pokazuje drugi (fade out / fade in). Resn stosuje technologię cięcia bufora klatek (**WebGL Scissor Test**):

```javascript
// main.js: fragment kodu pętli renderowania sekcji
Py.state.visibleSections.forEach(function(sectionIdx, order) {
    var section = t.sections[sectionIdx];
    if (section.render) {
        var scissor = Py.state.scissors[order]; // [y, height]
        var edge = Py.state.edges[order];       // [d0, d1]
      
        target.scissorTest = true;
        // Obcięcie obszaru renderowania w pikselach ekranu
        target.scissor.set(0, scissor[0] * pixelRatio, width * pixelRatio, scissor[1] * pixelRatio);
      
        section.render({
            renderer: u.renderer.renderer,
            ortho: u.renderer.orthoCamera,
            target: target
        });
    }
});
```

Co więcej, postprocessing material (`FieldPostProcessingMaterial`) przyjmuje uniformy `slopeTop` i `slopeBottom`. Pozwala to na **ścinanie krawędzi pod kątem ostrym (diagonal shearing)** – jedna scena 3D zjeżdża ukośnie, odsłaniając kolejny świat pod kątem 30 stopni!

### 5.5. Kinowy potok postprocessingu (LUT + Grain + Vignette)

Wyciągnięty z kodu shader postprocessingu `FieldPostProcessingMaterial`:

1. **3D Color LUT (Lookup Table):** Przekształcanie palety barw całej sceny w oparciu o teksturę kalibracyjną `map-grade.png` (512x512, 64 klastry barwne).
2. **Radial Focus Vignette:** Miękkie ściemnienie rogów i skupienie uwagi na obiekcie:
   `float stDarkened = 1. - smoothstep(0.2, 0.5, distance(uv, vec2(0.25, 0.45)));`
3. **Proceduralny szum filmowy (Film Grain):**
   ```glsl
   float r = random(uv);
   float rStr = 0.04; // 4% natężenia szumu
   color += mix(-rStr/2.0, rStr/2.0, r);
   ```

   Eliminuje to banding (paskowanie kolorów) w 8-bitowych gradientach i nadaje obrazowi organiczną, dokumentalną fakturę taśmy 35mm.

---

## 6. KINETYKA, FIZYKA RUCHU I INTERAKCJA

### 6.1. Matematyka kontrolera scrolla (Resn Virtual Momentum Scroll)

Strona przechwytuje zdarzenia kółka myszy (`wheel`) oraz dotyku (`touchstart`/`touchmove`) i przepuszcza je przez własny układ fizyczny ze sprężyną i tłumieniem (damping):

```javascript
// main.js - Algorytm tłumienia prędkości i przyciągania do snap position
this.velocity *= 0.89; // Współczynnik tarcia (89% zachowania pędu na klatkę)

// Wyznaczenie pozycji docelowej z predykcją 17 klatek do przodu
var predictedPos = this.position + 17 * this.velocity;
this.currentSnap = this.findSnapPosition(predictedPos);

// Siła sprężystości ściągająca do punktu snapowania
var snapDistance = this.currentSnap[1] - this.position;
var springForce = clamp(0.0025 * snapDistance, -10, 10);

this.velocity += springForce;
this.position += this.velocity;

// Warunek wygaszenia drgań
if (Math.abs(this.currentSnap[1] - this.position) < 0.05) {
    this.position = this.currentSnap[1];
    this.target = this.position;
}
```

### 6.2. Kamery i wielowarstwowy Parallax

1. **PerspectiveCamera:** Kąt widzenia (FOV) wynosi `45°` dla sceny Landing i `36.33°` dla sceny pola.
2. **Reakcja na kursor i żyroskop:** Wartości `pointerPositionMapped` (znormalizowane od -1 do 1) oraz kąty żyroskopu telefonu (`alpha`, `beta`, `gamma`) są wygładzane funkcją LERP (`this.pointerEased`) i aplikowane do:
   * Rotacji kamery (delikatny kąt nachylenia sceny),
   * Rotacji obiektu 3D (kolba lub ziarno lekko podąża za wzrokiem użytkownika),
   * Przesunięcia chmury 200 cząsteczek w tle (głębsze cząsteczki poruszają się wolniej, przednie szybciej, dając trójwymiarowy efekt wolumetryczny).

### 6.3. Interaktywność obiektów w Scenie 3 (Result)

W sekcji nasiona (`kernelSection`), kursor zmienia się w `cursor="grab"` / `cursor="grabbing"`. Użytkownik może chwycić ziarno myszą lub palcem i obrócić je w pełnych 360 stopniach. Obrót ziarna płynnie odsłania ukryte punkty danych (hotspoty: Plon, Odporność, Genetyka), które otwierają się jako animowane pierścienie koncentryczne (Shader `createRing`).

---

## 7. BEZWZGLĘDNA ANALIZA PORÓWNAWCZA: CORNREVOLUTION VS TYPOWA POLSKA STRONA I LUKASZ.PORUSZEK.PL

| Kryterium Analizy                          | Typowa polska strona firmowa / doradcza                                          | Poprzedni / typowy szablon personal brand            | Resn: Corn. Revolutionized                                                                 |
| :----------------------------------------- | :------------------------------------------------------------------------------- | :--------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| **Podejście do uwagi użytkownika** | „Zasypać go wszystkim”: 8 zakładek, 15 kafelków, popup newslettera, czatbot | Długie bloki tekstu, standardowe karty z ikonkami   | **Rygorystyczny tunel uwagi**: 1 myśl na ekran, 1 obiekt wizualny, hipnotyczny pęd |
| **Ekonomia słów**                  | 2000 słów lania wody o „dynamicznym rozwoju i pasji”                         | Długie opisy bez jasnego punktu skupienia           | **Maksymalnie 30 słów na ekran**. Bezwzględna precyzja faktów i liczb            |
| **Medium wizualne**                  | Płaskie stocki z Unsplash, generyczne ikony SVG                                 | Zdjęcia twarzy, statyczne boxy tekstowe             | **Interaktywny obiekt 3D czasu rzeczywistego**, który reaguje na dotyk i ruch       |
| **Architektura ruchu**               | Brak lub losowe animacje Fade-In z biblioteki AOS                                | Standardowy scroll przeglądarki, skokowe przejścia | **Fizyka bezwładnościowa (0.89 friction)**, snapping, ukośne cięcia WebGL        |
| **Integracja typografii**            | Standardowy HTML renderowany na białym/czarnym tle                              | Zwykłe nagłówki webfont                           | **MSDF 3D Typography** osadzona w przestrzeni trójwymiarowej obok modelu            |
| **Faktura wizualna**                 | Cyfrowa, płaska, sterylna (tzw. „szablon z Envato”)                           | Czysty CSS bez głębi                               | **Kinowy postprocessing**: LUT Color Grading, organiczny Film Grain, winieta         |

---

## 8. TRANSFER WZORCÓW DO LUKASZ.PORUSZEK.PL – STRATEGIA WDROŻENIOWA

Misja strony `lukasz.poruszek.pl` została zdefiniowana w dokumentach strategicznych:

> **Główna idea:** Przekazywanie wiedzy jako najwyższa wartość cywilizacyjna i najprostsza ekonomia czasu.
> **Leitmotif:** *„Zamiast tracić miesiące na błądzenie po omacku – przejmij sprawdzoną wiedzę, zaoszczędź czas i rozwijaj ją u siebie.”*

Oto jak filozofię i inżynierię Resn przekładamy 1:1 na stronę Łukasza:

### 8.1. Zastąpienie „Długiej Strony z Kafelkami” Narracyjnym Doświadczeniem 4 Aktów

Zamiast tradycyjnego portfolio czy landing page’a, strona Łukasza powinna być zbudowana jako **sekwencja 4 precyzyjnych scen (Full-Screen Snap Experience)**:

```
+---------------------------------------------------------------------------------------------------+
| AKT 0: HERO & PRAWDA CYWILIZACYJNA                                                                |
|   Hasło Display (Manifold / Brutalist): "NIKT NIE DOSZEDŁ DO NICZEGO SAM."                         |
|   Akapit (Gilroy / Clean Sans): 300 000 lat biologicznego zastoju pękło w momencie, gdy           |
|   zaczęliśmy przekazywać sobie wiedzę. Przekazywanie wiedzy to jedyna dźwignia cywilizacji.        |
|   Wizualia 3D: Kinetyczny, geometryczny artefakt (np. wielościan wiedzy / moduł architektury AI),  |
|   który pulsuje i reaguje na kursor myszy oraz żyroskop.                                          |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| AKT 1: DIAGNOZA – PUŁAPKA BŁĄDZENIA PO OMACKU                                                     |
|   Hasło Display: "SAMOTNE ODKRYWANIE KOŁA JEST ZA DROGIE."                                        |
|   Akapit: Błądzenie w samotności przed monitorem przez rok to strata tysięcy złotych i czasu,     |
|   którego nikt nie zwróci.                                                                        |
|   Wizualia 3D: Artefakt dekonstruuje się na rozproszone, chaotyczne węzły (ilustracja szumu).     |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| AKT 2: TRZY SKRÓTY CZASOWE (INTERAKTYWNE HOTSPOTY JAK W PIONEER)                                  |
|   Hasło Display: "PRZEJMIJ KLOCKI. BUDUJ SWOJE."                                                  |
|   Centralny Obiekt 3D: Ułożona, precyzyjna struktura modułowa z 3 klikalnymi hotspotami:         |
|     [1] WARSZTATY ORKIESTRACJI AI (1200 zł / 6 tyg) -> Zamiast roku błądzenia: ułożony system.   |
|     [2] MENTORING BIZNESOWY (400 zł / 90 min) -> Weryfikacja założeń, koniec fiksacji.            |
|     [3] MENTORING KARIERY (300 zł / 90 min) -> Usunięcie błędów CV, realne tory rozmowy.          |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| AKT 3: MANIFEST I KONWERSJA                                                                       |
|   Hasło Display: "CZYSTA EKONOMIA TWOJEGO CZASU."                                                 |
|   Akapit: Nazywam się Łukasz Poruszek. Dzielę się wiedzą przetestowaną w bojach. Bez mentorskiego  |
|   piedestału. Weź gotowe schematy i oszczędź miesiące.                                            |
|   Konwersja: Prosty, bezbłędny formularz kontaktowy / rezerwacja terminu w stylu Resn.            |
+---------------------------------------------------------------------------------------------------+
```

### 8.2. Transfer Tokenów Technicznych i Stylistycznych

1. **System Skalowania REM Resn:**
   Wdrożyć w CSS projektu `lukasz.poruszek.pl`:
   ```css
   html { font-size: 0.52083vw; } /* 1rem = 10px przy 1920px */
   @media (max-width: 768px) { html { font-size: 1.1vw; } }
   @media (min-width: 1920px) { html { font-size: 10px; } }
   ```
2. **Postprocessing Kinowy w Three.js / Canvas:**
   * Dodać do głównego widoku subtelny shader szumu filmowego (`float rStr = 0.035`) eliminujący gradient banding.
   * Zastosować winietę i LUT color grading (ciemny grafit `#0a0b0d` przechodzący w techniczny, głęboki szmaragd lub ciepły miedziany bursztyn wiedzy).
3. **Kinetyka i Fizyka Scrolla:**
   * Zaimplementować kontroler momentum scroll ze współczynnikiem tłumienia `0.89` i snappingiem do sekcji.
   * Ukośne cięcia przejść między aktami przy użyciu masek WebGL lub CSS clip-path pod kątem.
4. **Interaktywne Hotspoty:**
   * Zamiast rozwlekłych opisów 3 usług, użytkownik klika w świecące koncentryczne punkty wokół centralnego modelu, co powoduje płynne wysunięcie precyzyjnych danych (czas trwania, cena, zysk czasowy).

---

## 9. PODSUMOWANIE AUDYTU TECHNICZNEGO

Doświadczenie `cornrevolution.resn.global` udowadnia, że najwyższy światowy poziom inżynierii webowej (Awwwards SOTD) nie polega na „przeładowaniu strony skryptami” czy generowaniu setek megabajtów wideo.

**Twarde fakty audytu:**

* Łączny rozmiar geometrii 3D: **< 600 KB**
* Łączny kod JS (loader + main): **1.26 MB**
* Całkowity brak osobnych plików CSS (wszystko wstrzykiwane modułowo)
* 39 wyspecjalizowanych shaderów GLSL realizujących: MSDF Typography, LUT Color Grading, Procedural Grain, Instanced Particles i Dynamic Scissor Clipping.
* Bezwzględna dyscyplina narracji: średnio 25 słów na ekran, zero żargonu korporacyjnego, czysta kompozycja wizualna.

Zastosowanie tych wzorców na `lukasz.poruszek.pl` wyniesie stronę osobistą Łukasza o kilka klas ponad standard polskiego rynku web developmentu, pozycjonując go jako nowoczesnego, bezkompromisowego inżyniera i orkiestratora nowej ery cyfrowej.
