# ags-markmap: Shortcode with Data File Support

## Problem

The current module auto-generates markmap trees from **page headings (h1-h6)**. This works on `type: docs` pages where Hugo generates headings from the page tree, but does **not** work on `layout: landing` pages where the page tree doesn't auto-populate headings.

We need markmap to work on landing pages so authors can build custom course overview pages with full control over what the mind map displays.

---

## Solution

Add a **Hugo shortcode** that reads a structured data file and renders the markmap at the shortcode's position.

### Usage

```markdown
{{< ags-markmap "data/course/devops-structure.yaml" >}}
```

Single parameter: path relative to the Hugo `data/` directory.

---

## Data File Format (YAML)

The schema is designed to be simple enough for an AI agent to generate by scraping a course provider page (e.g. Coursera).

```yaml
# data/course/devops-structure.yaml
title: "IBM DevOps and Software Engineering Professional Certificate"
provider: "IBM"
url: "https://www.coursera.org/professional-certificates/devops-software-engineering"
initialExpandLevel: 2
children:
  - title: "01. Introduction to DevOps"
    url: /courses/ibm/devops-content/devops-pcert/01-introduction-to-devops/
    children:
      - title: "Module 1: Overview"
      - title: "Module 2: Social Coding Principles"
      - title: "Module 3: DevOps Practices"
      - title: "Module 4: Cloud & Microservices"
      - title: "Module 5: Final Project"
  - title: "02. Agile Development and Scrum"
    url: /courses/ibm/devops-content/devops-pcert/02-agile-development-and-scrum/
    children:
      - title: "Module 1: Agile Fundamentals"
      - title: "Module 2: Scrum Framework"
      - title: "Module 3: Agile Planning"
      - title: "Module 4: Project Management"
  - title: "03. Introduction to Linux"
    url: /courses/ibm/devops-content/devops-pcert/03-introduction-to-linux/
    children:
      - title: "Module 1: Linux Basics"
      - title: "Module 2: File Systems"
      - title: "Module 3: Shell Scripting"
      - title: "Module 4: System Administration"
  - title: "09. Introduction to Containers"
    url: /courses/ibm/devops-content/devops-pcert/09-introduction-to-containers/
    children:
      - title: "Module 1: Container Concepts"
      - title: "Module 2: Docker Basics"
      - title: "Module 3: Container Orchestration"
      - title: "Module 4: Registry & Repositories"
      - title: "Module 5: Production Considerations"
  - title: "10. Microservices"
    url: /courses/ibm/devops-content/devops-pcert/10-microservices/
    children:
      - title: "Module 1: Microservices Architecture"
      - title: "Module 2: API Design"
      - title: "Module 3: Service Communication"
      - title: "Module 4: Deployment Strategies"
  - title: "11. TDD & BDD"
    url: /courses/ibm/devops-content/devops-pcert/11-tdd-bdd/
    children:
      - title: "Module 1: Testing Fundamentals"
      - title: "Module 2: Test-Driven Development"
      - title: "Module 3: Behaviour-Driven Development"
      - title: "Module 4: Testing in CI/CD"
  - title: "16. Kubernetes Lab"
    url: /courses/ibm/devops-content/devops-pcert/16-k8s-lab/
    children:
      - title: "Module 1: K8s Fundamentals"
      - title: "Module 2: Pods & Deployments"
      - title: "Module 3: Services & Networking"
      - title: "Module 4: Storage & Config"
```

---

## Technical Requirements

### 1. Shortcode renders in-place

The current `head-end.html` hook auto-injects the markmap container at the **top** of the content area. The shortcode must instead render the container exactly where `{{< ags-markmap "file.yaml" >}}` is placed in the markdown. This lets authors control layout (e.g. lead text above, markmap below).

### 2. Click navigation on nodes

Each node can optionally include a `url:` field. When the user clicks a node, the browser navigates to that URL. This is essential for course browsing — users click a course in the mind map and go directly to it.

### 3. Works on all Hugo layouts

Must work on `layout: landing` pages, not only on `type: docs`. The shortcode approach is layout-agnostic by nature.

### 4. Styling consistency

The rendered SVG should use the same green border / rounded corners styling that the current auto-injected markmap uses.

### 5. Auto-fallback (nice to have)

If the page has `ags_markmap: true` in frontmatter but no shortcode, fall back to the current heading-based auto-detect (for backward compatibility with existing `type: docs` pages).

---

## Automation Pipeline

The data file format is designed so an **AI agent** can generate it:

```
1. Agent visits a course provider page (e.g. Coursera)
2. Agent extracts: specialization title, course names, module names, URLs
3. Agent generates a YAML file → data/course/<provider>/<cert>/structure.yaml
4. Author adds one shortcode line to the landing page:
   {{< ags-markmap "data/course/<provider>/<cert>/structure.yaml" >}}
```

---

## Priority Order

| Priority | Feature | Why |
|----------|---------|-----|
| P0 | Shortcode with YAML data file source | Core requirement, unblocks landing page use |
| P1 | Click navigation (`url:` field) | Essential for course browsing UX |
| P2 | Auto-fallback to heading mode | Backward compatibility |

---

## Example Page Using the Feature

```markdown
---
layout: landing
title: DevOps Engineering
---

{{% bs/lead %}}
The **IBM DevOps and Software Engineering Professional Certificate** equips you
with modern DevOps practices. Explore the courses below.
{{% /bs/lead %}}

{{< ags-markmap "data/course/devops-structure.yaml" >}}
```
