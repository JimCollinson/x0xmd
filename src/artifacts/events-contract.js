import { canonicalModel } from "../model/canonical.js";

export const EVENTS_CONTRACT_SCHEMA_VERSION = "1.0.0";
export const EVENTS_CONTRACT_PATH = "/machine/events-contract";

export function buildEventsContractArtifact() {
  return {
    schema_version: EVENTS_CONTRACT_SCHEMA_VERSION,
    contract_version: canonicalModel.events.contract_version,
    stream: canonicalModel.events.stream,
    envelope: canonicalModel.events.envelope,
    delivery_semantics: canonicalModel.events.delivery_semantics,
    transcript_examples: canonicalModel.events.transcript_examples
  };
}
