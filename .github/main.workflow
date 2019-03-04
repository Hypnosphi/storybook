
workflow "Trigger TeamCity on review" {
  on = "pull_request_review"
  resolves = "Trigger TeamCity Build"
}

workflow "Trigger TeamCity on label" {
  on = "label"
  resolves = "Trigger TeamCity Build"
}

action "Trigger TeamCity Build" {
  uses = "docker://node"
  runs = "node scripts/teamcity-trigger-build.js"
}
