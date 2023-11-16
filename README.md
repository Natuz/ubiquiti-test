# Overview

This is a test task required by Ubiquiti. A simple to-do list built on web sockets allowing users to collaborate in real-time.

The app consists of the following parts:

* NextJS as a main engine (https://nextjs.org).
* Ant Design as FE components library (https://ant.design).
* Yoga as a custom Graphql server (https://the-guild.dev/graphql/yoga-server).
* Bookshelf.js as an ORM (https://bookshelfjs.org).
* Apollo Graphql client (https://www.apollographql.com/docs/react).
* JWT as authentication/authorization mechanism (https://jwt.io).

# Deployment

Even though this is monorepo, both FE and BE are containerized and deployed separately.

Currently deployed to [Railway](https://railway.app/).

Demo available at: https://ubiquiti-test-production.up.railway.app

# Local setup

### Prerequisites
Make sure to have installed locally:
* MySQL
* nodejs
* yarn

### Setup
1. Clone the repo:
    ```bash
    git clone git@github.com:Natuz/ubiquiti-test.git
    ```

2. Create the `.env` file and set environment variables:
    ```bash
    cp .env.example .env
    ```
3. Install dependencies:
    ```bash
    yarn
    ```

4. Run servers:

    FE:
    ```bash
    yarn dev
    ```
    BE:
    ```bash
    yarn graphql-server
    ```

Open http://localhost:3001 with your browser to see the result.

# To Do

* Add Redis as a middleware standing between Graphql resolvers and controllers;
* Add database migrations mechanism, e.g. https://www.npmjs.com/package/db-migrate;
* Add docker-compose with FE, BE, Redis, and MySQL containers (also ideally to have prometheus/grafana containers to monitor the app);
* Add SWR to serve content even without internet connection - e.g. https://swr.vercel.app/docs/with-nextjs;
* Add missing business logic - proper authentication, list items editing, separate routes for each to-do item, etc;
* Add webGL library for VR - e.g. three.js is perfectly capable of serving VR including all the controls for both desktop and mobile https://threejs.org/docs/#api/en/geometries/BoxGeometry.

# Task Given

* **[done]** I as a user can create to-do items, such as a grocery list
* **[done]** I as another user can collaborate in real-time with user - so that we can
(for example) edit our family shopping-list together
* I as a user can mark to-do items as “done” - so that I can avoid clutter and focus on
things that are still pending
* **[done]** I as a user can filter the to-do list and view items that were marked as done - so that I
can retrospect on my prior progress
* I as a user can add sub-tasks to my to-do items - so that I could make logical groups of
tasks and see their overall progress
* I as a user can specify cost/price for a task or a subtask - so that I can track my
expenses / project cost
* I as a user can see the sum of the subtasks aggregated in the parent task - so that in my
shopping list I can see what contributes to the overall sum. For example I can have a
task “Salad”, where I'd add all ingredients as sub-tasks, and would see how much does
salad cost on my shopping list
* I as a user can make infinite nested levels of subtasks
* I as a user can add sub-descriptions of tasks in Markdown and view them as rich text
while I'm not editing the descriptions
* I as a user can see the cursor and/or selection of another-user as he selects/types when
he is editing text - so that we can discuss focused words during our online call.
* I as a user can create multiple to-do lists where each list has it's unique URL that I can
share with my friends - so that I could have separate to do lists for my groceries and
work related tasks
* In addition to regular to-do tasks, I as a user can add “special” typed to-do items, that will
have custom style and some required fields:
    * ”work-task”, which has a required field “deadline” - which is a date
    * “food” that has fields:
        * required: “carbohydrate”, “fat”, “protein” (each specified in g/100g)
        * optional: “picture” an URL to an image used to render this item
* I as a user can keep editing the list even when I lose internet connection, and can expect
it to sync up with BE as I regain connection
* I as a user can use my VR goggles to edit/browse multiple to-do lists in parallel in 3D
space so that I can feel ultra-productive
* I as a user can change the order of tasks via drag & drop
* I as a user can move/convert subtasks to tasks via drag & drop
* **[done]** I as a user can be sure that my todos will be persisted so that important information is
not lost when server restarts
* I as an owner/creator of a certain to-do list can freeze/unfreeze a to-do list I've created to
avoid other users from mutating it
