# GitHub Repository Explorer

This project is a Vue 3 single-page application built for the WestJet front-end take-home assignment.

The app lets users:

- search GitHub repositories
- view repository details
- save favorite repositories locally

## Tech Stack

- Vue 3
- Vue Router
- Fetch API
- Plain CSS
- localStorage

## Setup

Install dependencies:

```bash
npm install
```

Run the project locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Implemented Features

- Search repositories by keyword
- View repository results with name, owner, description, star count, primary language, and last updated date
- Load more search results
- Sort search results by stars or last updated
- View repository details at `/repo/:owner/:name`
- View open issues on the repository details page
- Add and remove favorites from the repository details page
- Save favorites in localStorage
- View saved repositories on a dedicated favorites page
- Show empty, loading, and error states
- Responsive layout for desktop and mobile

## Key Design Decisions

- Reused a `RepoCard` component for repository previews in both search results and favorites.
- Moved formatting and favorites logic into small utility files to keep the page components more focused.
- Chose to show open issues on the repository details page because I felt it was more useful to see the current state of a repository than to focus on who contributed to it.
- Used a Load More pattern instead of numbered pagination because it kept the search flow simple and would be easier to extend into infinite scrolling later.

## Project Structure

```text
src/
  components/
    RepoCard.vue
  pages/
    SearchPage.vue
    RepoDetailsPage.vue
    FavoritesPage.vue
  utils/
    favorites.js
    formatters.js
  router.js
  App.vue
```

## Known Limitations

- The app uses the public GitHub API, so it can run into rate limits with repeated requests.
- Favorites are only stored in localStorage, so they are limited to the current browser.
- Search state is not persisted when leaving and returning to the page.

## Future Improvements

- Keep the latest search and results when returning to the search page.
- Add a recent search history component so past searches are easier to reuse.
- Update the search experience with debounced input and optional search-on-type behavior.
- Replace the current Load More interaction with infinite scrolling.
- Add automated tests for key components or utility logic.
