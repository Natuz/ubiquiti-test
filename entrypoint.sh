#!/usr/bin/env bash
set -Ex

# An ugly hack for env variables that should be exposed to FE in Nextjs (https://github.com/vercel/next.js/discussions/17641)
function apply_path {
    find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#GRAPHQL_HTTP_URL#$GRAPHQL_HTTP_URL#g"
    find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#GRAPHQL_WS_URL#$GRAPHQL_WS_URL#g"
}

apply_path
echo "Starting NextJS"
exec "$@"
