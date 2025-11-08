# Simple Prompts

A beautiful single-page dashboard for storing and managing prompts and notes.

PROJECT CANCELLED because the complexity is too high with the Notion API. It is asking me to setup a separate server (a seconde project) to make the requests.

> Due to security concerns of exposing API tokens in the browser, Notion public API requests aren't able to be made from a web browser. You'll have to make the requests server side and then send the results to the browser

*Issues · makenotion/notion-sdk-js* <https://github.com/makenotion/notion-sdk-js/issues?q=is%3Aissue%20state%3Aclosed%20CORS>

## Overview

This project is a modern, responsive, and mobile-first web application built with Vite, Vue.js, and Vuetify. It allows users to browse, search, and filter a collection of prompts fetched from a Notion database.

## Installation

1.  Clone the repository: `git clone <repository-url>`
2.  Install dependencies: `npm install`
3.  Set up environment variables: Create a `.env` file and add your Notion API key and database ID.
4.  Run the development server: `npm run dev`

## Usage

-   Browse prompts in a grid view.
-   Search for prompts using the search bar.
-   Filter prompts by favorites or tags.
-   Copy prompt content or the entire prompt with a single click.