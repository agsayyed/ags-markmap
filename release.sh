#!/bin/bash

# Simple release script for ags-markmap
# Usage: ./release.sh v0.1.2 "Feature Description"

if [ $# -ne 2 ]; then
    echo "Usage: $0 <version> <description>"
    echo "Example: $0 v0.1.2 'Added new feature'"
    exit 1
fi

VERSION=$1
DESCRIPTION=$2

echo "🚀 Creating release $VERSION..."

# Update package.json version (remove 'v' prefix for package.json)
PACKAGE_VERSION=${VERSION#v}
sed -i "s/\"version\": \".*\"/\"version\": \"$PACKAGE_VERSION\"/" package.json

# Commit changes
git add .
git commit -m "chore: release $VERSION"

# Create tag
git tag $VERSION -m "Release $VERSION: $DESCRIPTION"

# Push everything
git push origin main --tags

# Create GitHub release
gh release create $VERSION \
    --title "$VERSION - $DESCRIPTION" \
    --notes "## What's New

$DESCRIPTION

See [CHANGELOG.md](https://github.com/agsayyed/ags-markmap/blob/main/CHANGELOG.md) for full details.

## Installation
\`\`\`yaml
module:
  imports:
    - path: github.com/agsayyed/ags-markmap
      version: $VERSION
\`\`\`"

echo "✅ Release $VERSION created successfully!"
echo "🌐 View at: https://github.com/agsayyed/ags-markmap/releases/tag/$VERSION"
