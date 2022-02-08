# Test Project

## Development

### Pre-requisites

- Install Docker
  - [For Mac](https://docs.docker.com/docker-for-mac/install/)
  - [For Windows](https://docs.docker.com/docker-for-windows/)
  - For Linux, use your distro's package management system
- [Install yarn](https://yarnpkg.com/getting-started/install)

### Running the application

This application runs on docker. To run the application for development, run `yarn docker:compose`. If you'd like to run it in daemon mode, just run `yarn docker:compose -d`.

### Architecture

This repo is structured using [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/). These workspaces are organized in the following way:

- `web`: A typescript React web app running on NextJs

### Storybook

The `web` package also features a storybook for components. To run:

- `cd web`
- `yarn`
- `yarn storybook`
- Navigate to localhost:6006 in your browser

Alternatively this can be run through docker via `yarn docker:compose:storybook` from the root of the repo
