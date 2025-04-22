# Uruchomienie aplikacji w GitHub Codespaces

Ta instrukcja przeprowadzi Cię przez proces uruchomienia aplikacji Task App w środowisku GitHub Codespaces.

## Krok 1: Uruchomienie Codespaces

1. Przejdź do głównej strony repozytorium: https://github.com/djmisieq/simple-task-app
2. Kliknij zielony przycisk **Code**
3. Wybierz zakładkę **Codespaces**
4. Kliknij przycisk **Create codespace on main**

![Uruchomienie Codespaces](https://docs.github.com/assets/cb-214643/mw-1440/images/help/codespaces/default-machine-type.webp)

## Krok 2: Poczekaj na inicjalizację środowiska

GitHub przygotuje dla Ciebie w pełni skonfigurowane środowisko deweloperskie w chmurze. Poczekaj kilka chwil aż proces się zakończy.

## Krok 3: Uruchomienie aplikacji

Są dwa sposoby na uruchomienie aplikacji:

### Sposób 1: Użycie Simple Browser

1. Po załadowaniu Codespace, w dolnym panelu VS Code wybierz zakładkę **PORTS**
2. Kliknij przycisk **Forward a Port**
3. Wpisz port `8080` i zatwierdź
4. Kliknij ikonę globusa obok portu, aby otworzyć aplikację w przeglądarce

### Sposób 2: Użycie lokalnego serwera

1. W terminalu Codespaces wykonaj jedną z poniższych komend:

```bash
# Jeśli masz zainstalowany Python
python -m http.server 8080

# LUB jeśli wolisz użyć Node.js
npx http-server -p 8080
```

2. Po uruchomieniu serwera, kliknij link wyświetlony w terminalu lub otwórz port `8080` w zakładce **PORTS**

## Krok 4: Praca z aplikacją

Teraz możesz korzystać z aplikacji do zarządzania zadaniami w środowisku Codespaces:

1. Dodawaj nowe zadania w polu tekstowym
2. Zaznaczaj zadania jako ukończone klikając w checkbox
3. Usuwaj zadania klikając przycisk 'x'
4. Filtruj zadania korzystając z przycisków w sekcji filtrów

## Krok 5: Modyfikacja kodu (opcjonalnie)

Możesz modyfikować kod aplikacji bezpośrednio w Codespaces:

1. Pliki aplikacji są dostępne w eksploratorze plików po lewej stronie
2. Wprowadź zmiany w kodzie HTML, CSS lub JavaScript
3. Odśwież przeglądarkę, aby zobaczyć wprowadzone zmiany

## Uwagi dodatkowe

- Wszystkie zmiany wprowadzone przez Ciebie w Codespaces są zapisywane automatycznie
- Jeśli chcesz zapisać zmiany w repozytorium, użyj panelu Source Control (Ctrl+Shift+G) w VS Code
- Aplikacja korzysta z localStorage przeglądarki do przechowywania zadań, więc zadania są zapisywane lokalnie w przeglądarce

## Zamykanie Codespaces

Aby zamknąć Codespace:
1. Kliknij menu w lewym dolnym rogu z Twoją nazwą użytkownika GitHub
2. Wybierz opcję **Close Remote Connection**

Możesz wrócić do Codespace w dowolnym momencie na stronie: https://github.com/codespaces