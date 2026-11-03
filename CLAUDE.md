# Książka Serwisowa — instrukcja projektu

## Co budujemy
Aplikacja do prowadzenia historii serwisowej pojazdów. Docelowo dla dwóch grup:
- **Kierowcy prywatni** — własne auta, przypomnienia o serwisie, historia i koszty.
- **Warsztaty** — klienci, ich auta, wpisy serwisowe, które trafiają do książki klienta.

Aplikacja składa się z trzech plików: `index.html` (układ strony), `style.css` (wygląd), `app.js` (logika).
Dane zapisują się w `localStorage` przeglądarki.

## O autorze
Karol, 18 lat, uczy się programowania (podstawy JavaScript). Pracuje w warsztacie samochodowym.
- **Pisz po polsku.**
- **Po każdej zmianie krótko wytłumacz, co zmieniłeś i dlaczego** — prostym językiem, bez żargonu.
- Rób małe kroki. Jedno zadanie na raz. Po każdym działającym kroku zaproponuj `git commit`.
- Zanim zrobisz coś dużego, pokaż plan i poczekaj na zgodę.

## Zasady
- Nie usuwaj istniejących funkcji bez pytania.
- Mobile-first: aplikacja ma dobrze działać na telefonie.
- Interfejs po polsku. Jednostki: km, PLN, daty DD.MM.RRRR.
- Kod czytelny, z komentarzami po polsku w trudniejszych miejscach.

## Plan (etapy)

### Etap 1 — porządek i PWA
- [x] Zainicjować git.
- [x] Rozdzielić `index.html` na `index.html`, `style.css`, `app.js`.
- [ ] Usunąć zależność od `window.claude` (to działało tylko w artefakcie Claude) — zostaje `localStorage`.
- [ ] Dodać `manifest.json` i ikonę, żeby dało się „dodać do ekranu głównego”.
- [ ] Dodać service worker — działanie offline.
- [ ] Wrzucić na darmowy hosting (Netlify lub GitHub Pages).

### Etap 2 — brakujące funkcje dla kierowcy
- [ ] Pełna historia każdej pozycji (wszystkie wymiany, nie tylko ostatnia).
- [ ] Koszt, warsztat i notatka przy każdym wpisie; podsumowanie kosztów auta.
- [ ] Eksport historii do PDF (przydatne przy sprzedaży auta).
- [ ] Eksport/import kopii zapasowej (plik JSON).

### Etap 3 — konta i chmura (Supabase)
- [ ] Logowanie (e-mail).
- [ ] Przeniesienie danych z `localStorage` do bazy Supabase — synchronizacja między urządzeniami.
- [ ] Zdjęcia faktur i licznika.
- [ ] Model danych przewiduje od początku: pojazd może mieć przypisany warsztat.

### Etap 4 — panel warsztatu
- [ ] Konto typu „warsztat”.
- [ ] Lista klientów i ich pojazdów.
- [ ] Wpis serwisowy dodany przez warsztat pojawia się w książce klienta (za jego zgodą).
- [ ] Przypomnienia dla klientów o zbliżającym się serwisie.

### Etap 5 — aplikacja w sklepie
- [ ] Opakowanie w Capacitor i wydanie na Androida.

## Aktualny etap
Etap 1.
