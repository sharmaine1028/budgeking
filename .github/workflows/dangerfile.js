import { danger, warn, fail } from "danger";

const reviewLargePR = () => {
  const bigPRThreshold = 1000;
  if (
    danger.github.pr.additions + danger.github.pr.deletions >
    bigPRThreshold
  ) {
    warn(
      `:exclamation: Pull Request size seems relatively large. If Pull Request contains multiple changes, split each into separate PR for faster, easier review.`
    );
  }
};
const ensurePRHasAssignee = () => {
  // Always ensure we assign someone, so that our Slackbot can do its work correctly
  if (danger.github.pr.assignee === null) {
    fail(
      "Please assign someone to merge this PR, and optionally include people who should review."
    );
  }
};
reviewLargePR();
ensurePRHasAssignee();
