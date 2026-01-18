# Task Manager - Nowoczesna aplikacja do zarządzania zadaniami

Prosta, ale elegancka aplikacja do zarządzania zadaniami z nowoczesnym interfejsem użytkownika i trybem ciemnym. Stworzona przy użyciu HTML, CSS i czystego JavaScript.

![Screenshot aplikacji](https://via.placeholder.com/800x450.png?text=Task+Manager+Screenshot)

## Funkcjonalności

- ✅ Dodawanie nowych zadań na początek listy
- ✅ Oznaczanie zadań jako ukończone
- ✅ Usuwanie zadań
- ✅ Filtrowanie zadań (wszystkie, aktywne, ukończone)
- ✅ Wyświetlanie liczby pozostałych zadań
- ✅ Czyszczenie ukończonych zadań
- ✅ Lokalne przechowywanie zadań (localStorage)
- ✅ Inteligentny tryb ciemny (respektuje preferencje systemowe)
- ✅ Responsywny design (działa na urządzeniach mobilnych)
- ✅ Dostępność (ARIA, semantyczny HTML)

## Uruchomienie aplikacji

### Lokalnie

1. Sklonuj to repozytorium
2. Otwórz plik `index.html` w przeglądarce
3. Zacznij zarządzać swoimi zadaniami!

### W GitHub Codespaces (zalecane)

[![Otwórz w GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=970869557)

1. Kliknij przycisk "Otwórz w GitHub Codespaces" powyżej
2. Po załadowaniu środowiska, uruchom jeden z poniższych serwerów w terminalu:

```bash
# Z Node.js
npx http-server -p 8080

# Lub z Python
python -m http.server 8080
```

3. Otwórz aplikację w przeglądarce (link pojawi się w konsoli)

## Tryb ciemny (Dark Mode)

Aplikacja automatycznie wykrywa preferencje systemowe i dostosowuje motyw:

- 🌙 Jeśli Twój system jest ustawiony na tryb ciemny, aplikacja również będzie w trybie ciemnym
- ☀️ Możesz ręcznie przełączać tryb klikając ikonę księżyca/słońca w prawym górnym rogu
- 💾 Twój wybór jest zapamiętywany w lokalnej pamięci przeglądarki

## Obsługa z klawiatury

- `Enter` w polu input dodaje nowe zadanie
- `Tab` umożliwia nawigację między elementami interfejsu
- Checkbox tasks można zaznaczać za pomocą klawiatury (spacja po wybraniu checkboxa)

## Struktura projektu

```
├── index.html           # Główny plik HTML
├── css/
│   └── style.css        # Style CSS z zmiennymi dla trybu ciemnego
├── js/
│   └── app.js           # Logika aplikacji w JavaScript
├── .devcontainer/       # Konfiguracja dla GitHub Codespaces
└── README.md            # Ten plik README
```

## Technologie

- HTML5 semantyczny
- CSS3 z zmiennymi CSS (custom properties)
- Vanilla JavaScript (ES6+)
- Font Awesome dla ikon
- Google Fonts (Inter)
- LocalStorage API

## Rozwój projektu

Możliwe usprawnienia na przyszłość:

- Dodanie priorytetów dla zadań
- Dodanie kategorii/tagów
- Powiadomienia o terminach
- Synchronizacja z backendem
- Dodanie animacji i przejść

## Licencja

MIT