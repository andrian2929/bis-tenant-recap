## Introduction

Command line tool to recap count and average of opportunity and closed-win

## Requirement

- Node 20 or higher

## Usage

1. Set up your jira configuration by copying env.example to .env:
   ```bash
    cp env.example .env
   ```
2. Install all package and dependencies.
   ```bash
    npm install
   ```
3. Build the project
    ```bash
    npm run build
    ```
4. Run the script
    ```bash
    node dist/Main.js --since 2023-04-04 --until 2024-03-03
    ```
5. This tool will generate json file, output.json
   Example:
   ```json
    [
      {
        "id": "e09bcae1-91d8-4186-966c-8926e87cb5ac",
        "name": "Elroy Stevens",
        "opportunityConversionSum": 36461493,
        "opportunityConversionAverage": 492722.8784,
        "opportunityConversionCount": 74,
        "closedWinConversionSum": 47280781,
        "closedWinConversionAverage": 2055686.1304,
        "closedWinConversionCount": 23
      },
      {
        "id": "30cbd73a-5c87-435c-9e45-1b33261e27b2",
        "name": "Duane Weber",
        "opportunityConversionSum": 302427527,
        "opportunityConversionAverage": 4032367.0267,
        "opportunityConversionCount": 75,
        "closedWinConversionSum": 517957,
        "closedWinConversionAverage": 258978.5,
        "closedWinConversionCount": 2
      }
    ]
   ```

## Run globally

If you want to run this script globally, just simply run this command first in the project directory

```bash
sudo npm install -g .
```

Now you can run this program everywhere, just simply by typing this

```bash
bis-tenant --since 2023-04-04 --until 2024-03-03
```

## Help

```bash
Usage: Jira issue tracker

Options:
  -s, --since <since>  Since date
  -u, --until <until>  Until date
  -h, --help           display help for command
```

## Authors

- [@andrian2929](https://www.github.com/andrian2929)

**Made with ❤️ by Aan**
