/** Machine guard, not proof of owner or employer authorization. */
export function requireRelease(config, version, {ref, sha, requestedSha, confirmation}) {
  if (ref !== 'refs/heads/main') throw new Error('Only main may be published');
  if (!/^[a-f0-9]{40}$/.test(sha ?? '') || requestedSha !== sha) throw new Error('The requested SHA must match the checked-out workflow commit');
  if (confirmation !== 'PUBLISH APPROVED PORTFOLIO') throw new Error('Explicit publication confirmation required');
  if (config.publicationEnabled !== true) throw new Error('Publication is disabled');
  if (typeof config.approvalReference !== 'string' || !/^PP-0[0-9]{2}[A-Z]?(?:-[0-9]{3})?$/.test(config.approvalReference)) throw new Error('Launch approval reference required');
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version) || Number(version.split('.')[0]) < 1 || config.releaseVersion !== version) throw new Error('Approved production version required');
}
