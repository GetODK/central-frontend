/*
Copyright 2023 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/getodk/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
*/
import { useRequestData } from './index';

// Offline branch
class Branch {
  constructor(firstUpdate, versions) {
    if (firstUpdate.trunkVersion != null) {
      // The first version from the branch to be processed (not necessarily the
      // first in branch order).
      this.first = firstUpdate;
      // How many versions that have been processed are from the branch?
      this.length = 1;
      // Was firstUpdate processed in branch order, or was it processed before
      // an earlier change in the branch?
      this.firstInOrder = firstUpdate.branchBaseVersion === firstUpdate.trunkVersion;
      /* this.lastContiguous is the version number of the last version from the
      branch for which the branch has been contiguous, i.e., the last version
      since the trunk version for which there has been no update from outside
      the branch. If the base version of firstUpdate is the trunk version, then
      the branch is at least partially contiguous. this.lastContinguous is not
      related to branch order: as long as there hasn't been an update from
      outside the branch, the branch is contiguous, regardless of the order of
      the updates within it. */
      this.lastContiguous = firstUpdate.baseVersion === firstUpdate.trunkVersion
        ? firstUpdate.version
        : 0;
    } else {
      // If the entity was both created and updated offline before being sent to
      // the server, then we treat the creation as part of the same branch as
      // the update(s). The creation doesn't have a branch ID, but we treat it
      // as part of the branch anyway.
      this.first = versions[0]; // eslint-disable-line prefer-destructuring
      // If the creating submission was received late and processed out of
      // order, then firstUpdate === versions[0]. In that case, we can't
      // reliably determine which entity version corresponds to the entity
      // creation, so we don't treat the creation as part of the branch.
      this.length = firstUpdate === versions[0] ? 1 : 2;
      this.firstInOrder = this.length === 2 &&
        firstUpdate.branchBaseVersion === 1;
      this.lastContiguous = this.length === 2 && firstUpdate !== versions[1]
        ? 1
        : firstUpdate.version;
    }

    this.id = firstUpdate.branchId;
    // The last version from the branch to be processed
    this.last = firstUpdate;
  }

  add(version) {
    this.length += 1;
    this.last = version;
    if (version.baseVersion === this.lastContiguous &&
      version.version === version.baseVersion + 1)
      this.lastContiguous = version.version;
  }
}

export default () => {
  const { createResource } = useRequestData();
  return createResource('entityVersions', () => ({
    transformResponse: ({ data: versions }) => {
      const branches = new Map();
      for (const version of versions) {
        // Track offline branches.
        const { branchId } = version;
        if (branchId != null && version.branchBaseVersion != null) {
          const existingBranch = branches.get(branchId);
          if (existingBranch == null) {
            const newBranch = new Branch(version, versions);
            branches.set(branchId, newBranch);
            version.branch = newBranch;
            // If the entity was created offline, then add the branch to the
            // entity creation.
            version.branch.first.branch = newBranch;
          } else {
            existingBranch.add(version);
            version.branch = existingBranch;
          }
        }

        // Convert some arrays to sets.
        version.baseDiff = new Set(version.baseDiff);
        version.serverDiff = new Set(version.serverDiff);
        const { conflictingProperties } = version;
        version.conflictingProperties = conflictingProperties != null
          ? new Set(conflictingProperties)
          : new Set();
      }

      // Ignore single-updated "branches."
      for (const branch of branches.values()) {
        if (branch.length === 1 && branch.firstInOrder)
          delete branch.first.branch;
      }

      return versions;
    }
  }));
};
