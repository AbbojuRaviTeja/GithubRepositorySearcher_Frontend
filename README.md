# GitHub Repository Searcher

Frontend for the Spring Boot API in `GithubRepositorySearcher_Backend`. Search stores matches in PostgreSQL. The saved page reads that database through the API.

## Run

1. Start PostgreSQL and the backend so it listens on port 8080:

```bash
cd ../GithubRepositorySearcher_Backend
mvn -B spring-boot:run
```

2. In this folder:

```bash
npm install
npm run dev
```

Open http://localhost:5173.

`npm run build` writes a production bundle to `dist`. `npm run preview` serves that bundle on http://localhost:4173 and proxies `/api` the same way as the dev server.

## API

`VITE_API_BASE_URL` defaults to `http://localhost:8080` (see `.env.example`). Copy it to `.env` if you need a different host.

During `npm run dev` and `npm run preview`, the browser calls `/api` on the Vite origin. Vite forwards those requests to `VITE_API_BASE_URL`. That avoids a CORS change in the backend, which does not send CORS headers.

A production static host that does not proxy `/api` uses `VITE_API_BASE_URL` directly from the Axios client. That host needs the API to allow the frontend origin. Do not put a GitHub token in this project.

## What the UI calls

| Action | Request |
| --- | --- |
| Search | `POST /api/github/search` with `query`, optional `language`, and `sort` (`stars`, `forks`, `updated`) |
| Saved list | `GET /api/github/repositories` with optional `language`, `minStars`, `sort`, `page`, `size` |
| Details | `GET /api/github/repositories/{githubId}` |

The list response includes `repositories`, `page`, `size`, `totalElements`, and `totalPages`. Page indexes start at 0. Page size in the UI is 10, 20, or 50.

The repository payload does not include `htmlUrl`. When both owner and name are present, "View on GitHub" links to `https://github.com/{owner}/{name}`.

## Layout

```
src/
  components/   navbar, search, filters, repository list, loading, errors
  pages/        search, saved repositories, repository details
  services/     Axios client
  hooks/        saved-repository query state
  utils/        formatting, option lists, client validation
  styles/       global.css
```
