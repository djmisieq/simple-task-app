# Prosta Aplikacja do Zarządzania Zadaniami

To jest prosta aplikacja frontendowa do tworzenia i zarządzania listą zadań, stworzona przy użyciu HTML, CSS i JavaScript.

## Funkcjonalności

- Dodawanie nowych zadań
- Oznaczanie zadań jako ukończone
- Usuwanie zadań
- Filtrowanie zadań (wszystkie, aktywne, ukończone)
- Wyświetlanie liczby pozostałych zadań
- Czyszczenie ukończonych zadań
- Lokalne przechowywanie zadań (localStorage)

## Uruchomienie aplikacji

### Lokalnie

1. Sklonuj to repozytorium
2. Otwórz plik `index.html` w przeglądarce
3. Zacznij zarządzać swoimi zadaniami!

### W GitHub Codespaces (zalecane)

[![Otwórz w GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=970869557)

1. Kliknij przycisk "Otwórz w GitHub Codespaces" powyżej
2. Po załadowaniu środowiska, aplikacja zostanie automatycznie uruchomiona na porcie 8080
3. Kliknij link w powiadomieniu lub przejdź do zakładki "PORTS" i otwórz port 8080

Szczegółowe instrukcje uruchomienia w Codespaces znajdziesz w pliku [CODESPACES.md](CODESPACES.md).

## Struktura projektu

```
├── index.html           # Główny plik HTML
├── css/
│   └── style.css        # Style CSS
├── js/
│   └── app.js           # Logika aplikacji w JavaScript
├── .devcontainer/       # Konfiguracja dla GitHub Codespaces
└── README.md            # Ten plik README
```

## Rozwój projektu

Możliwe usprawnienia na przyszłość:

- Dodanie priorytetów dla zadań
- Dodanie kategorii/tagów
- Powiadomienia o terminach
- Synchronizacja z backendem

## Licencja

MIT