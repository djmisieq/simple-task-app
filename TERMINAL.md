# Uruchomienie aplikacji z terminala w GitHub Codespaces

Ta instrukcja zawiera krok po kroku, jak uruchomić aplikację Task App z poziomu terminala w środowisku GitHub Codespaces.

## Krok 1: Uruchomienie GitHub Codespaces

1. Przejdź do repozytorium: https://github.com/djmisieq/simple-task-app
2. Kliknij zielony przycisk **Code**
3. Wybierz zakładkę **Codespaces**
4. Kliknij przycisk **Create codespace on main**

## Krok 2: Pobranie najnowszych zmian z repozytorium GitHub

Aby upewnić się, że masz najnowszą wersję kodu, wykonaj w terminalu:

```bash
# Pobierz najnowsze zmiany z repozytorium
git pull origin main
```

Jeśli otrzymasz komunikat o konfliktach, możesz wykonać:

```bash
# Odrzuć lokalne zmiany i zastosuj zmiany z repozytorium
git reset --hard origin/main
```

## Krok 3: Korzystanie z terminala

Po załadowaniu Codespaces, zobaczysz interfejs Visual Studio Code z terminalem na dole. Jeśli terminal nie jest widoczny:

1. Naciśnij kombinację klawiszy `Ctrl+` (lub `Cmd+` na macOS)
2. Lub wybierz z menu: **Terminal** -> **New Terminal**

## Krok 4: Uruchomienie serwera HTTP z terminala

W terminalu możesz użyć jednej z następujących komend, aby uruchomić serwer HTTP:

### Opcja A: Użycie Node.js (http-server)

```bash
# Instalacja http-server (jeśli nie jest zainstalowany)
npm install -g http-server

# Uruchomienie serwera HTTP na porcie 8080
http-server -p 8080
```

### Opcja B: Użycie Pythona

```bash
# Użycie wbudowanego serwera HTTP w Pythonie
python -m http.server 8080
```

### Opcja C: Użycie przygotowanego skryptu

```bash
# Nadanie uprawnień do wykonania skryptu
chmod +x .devcontainer/start-server.sh

# Uruchomienie skryptu
.devcontainer/start-server.sh
```

## Krok 5: Dostęp do aplikacji

Po uruchomieniu serwera w terminalu:

1. W dolnym panelu VS Code pojawi się powiadomienie o otwartym porcie 8080
2. Kliknij przycisk **Open in Browser** aby otworzyć aplikację
3. Lub otwórz zakładkę **PORTS** w dolnym panelu, znajdź port 8080 i kliknij ikonę globusa, aby otworzyć w przeglądarce

## Zatrzymanie serwera

Aby zatrzymać działający serwer HTTP:

1. Przejdź do terminala, w którym uruchomiony jest serwer
2. Naciśnij kombinację klawiszy `Ctrl+C`

## Rozwiązywanie problemów

Jeśli port 8080 jest już zajęty:

```bash
# Użyj innego portu, np. 8081
http-server -p 8081
# lub
python -m http.server 8081
```

Jeśli terminal wyświetla błąd "Permission denied" przy uruchamianiu skryptu:

```bash
# Nadaj uprawnienia do wykonania skryptu
chmod +x .devcontainer/start-server.sh
```