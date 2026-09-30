# ToDo DevOps Submission

## Repository

- GitHub: https://github.com/griagamj-off/DEV-OPS-GRIAGA-MARK
- Production branch: `main`
- Development branch: `develop`
- Release branch: `release/v1.0`
- Feature branches: `feature/add-task`, `feature/complete-task`, `feature/delete-task`, `feature/version-banner`

The application is built with Next.js and React. Tasks are stored in browser local storage; no database is used. The `main` and `release/v1.0` branches show Version 1.0. The `develop` branch includes the Version 1.1 Development banner.

## Environments

The GitHub branches are published. Vercel deployments have not been created yet, so deployment URLs must be filled in after connecting the repository to a Vercel account.

| Environment | Branch | URL |
| --- | --- | --- |
| Development | `develop` | Pending Vercel setup |
| Staging | `release/v1.0` | Pending Vercel setup |
| Production | `main` | Pending Vercel setup |

One straightforward Vercel setup is to create three projects from this repository, setting each project's Production Branch to the branch in the table. Assign a distinct project domain to each. This makes pushes to each selected branch deploy to its corresponding environment. Keep the development and staging project domains separate from the production domain.

## Verification

- `npm run build`: passed.
- `npm run lint`: passed.
- Local browser check: adding, completing, deleting, and browser-local persistence passed.
- Empty task handling: whitespace-only input cannot be submitted.
- Staging and production URLs: pending Vercel setup and deployment.

## Evidence Checklist

- [ ] Local Next.js app and development terminal
- [ ] GitHub repository and branch list
- [ ] Add, complete, and delete task behavior
- [ ] `feature/version-banner` merged into `develop`
- [ ] Development deployment on `develop`
- [ ] `release/v1.0` branch and staging deployment
- [ ] Staging checklist results
- [ ] Production deployment on `main`
- [ ] Version 1.1 Development compared with Version 1.0 Production

## Reflection

### 1. What is the purpose of the develop branch?

The `develop` branch is the integration point for completed features before a release is prepared. It gives the team a place to test combined changes without changing the production version on `main`.

### 2. Why use feature branches instead of modifying main directly?

Feature branches isolate one change so it can be developed and reviewed without destabilizing the production branch. They also make it easier to test, discuss, and merge work independently.

### 3. What is the purpose of a staging environment?

Staging provides a production-like place to test a release candidate before users receive it. It helps uncover integration, configuration, and usability problems while the release can still be corrected.

### 4. What is the difference between Development, Staging, and Production?

Development contains the newest integrated work and may change frequently. Staging contains a release candidate for final checks, while Production contains the stable version intended for users.

### 5. Why test in Staging before Production?

Staging testing reduces the chance that defects or deployment issues reach users. It also verifies the release in an environment closer to production than a developer's local machine.