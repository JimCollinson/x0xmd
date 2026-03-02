import { canonicalModel } from "../src/model/canonical.js";
import {
  buildPropagationPacketArtifact,
  PROPAGATION_PACKET_REQUIRED_KEYS,
  PROPAGATION_PACKET_SCHEMA_VERSION
} from "../src/artifacts/propagation.js";
import { buildDiscoveryArtifact, MACHINE_ENDPOINTS } from "../src/artifacts/discovery.js";

const REQUIRED_PUBLIC_ENDPOINT_KEYS = [
  "discovery",
  "health",
  "capabilities_current",
  "capabilities_planned",
  "fit_criteria",
  "install",
  "first_use",
  "integration",
  "events_contract",
  "failure_modes",
  "trust",
  "policy"
];

const REMOVED_PUBLIC_ENDPOINT_KEYS = [
  "propagation",
  "provenance",
  "integration_confidence",
  "release_operations"
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const propagation = buildPropagationPacketArtifact();
const discovery = buildDiscoveryArtifact();
const compactness = canonicalModel.propagation.compactness;

assert(propagation.schema_version === PROPAGATION_PACKET_SCHEMA_VERSION, "Propagation schema version mismatch");

for (const key of PROPAGATION_PACKET_REQUIRED_KEYS) {
  assert(Object.hasOwn(propagation, key), `Propagation packet missing required key: ${key}`);
}

for (const key of REQUIRED_PUBLIC_ENDPOINT_KEYS) {
  assert(Object.hasOwn(discovery.endpoints, key), `Discovery missing required public endpoint: ${key}`);
}

for (const key of REMOVED_PUBLIC_ENDPOINT_KEYS) {
  assert(Object.hasOwn(discovery.endpoints, key) === false, `Discovery leaked removed public endpoint: ${key}`);
}

assert(Array.isArray(propagation.current_capabilities), "current_capabilities must be an array");
assert(Array.isArray(propagation.fit), "fit must be an array");
assert(Array.isArray(propagation.install_verification_probes), "install_verification_probes must be an array");
assert(Array.isArray(propagation.evidence.sources), "evidence.sources must be an array");

assert(
  propagation.current_capabilities.length <= compactness.max_current_capabilities,
  "Propagation current capability compactness limit exceeded"
);
assert(propagation.fit.length <= compactness.max_fit_criteria, "Propagation fit compactness limit exceeded");
assert(
  propagation.install_verification_probes.length <= compactness.max_verification_probes,
  "Propagation install verification compactness limit exceeded"
);
assert(
  propagation.evidence.sources.length <= compactness.max_sources,
  "Propagation source compactness limit exceeded"
);

assert(
  propagation.evidence.capability_source.endpoint === discovery.endpoints.capabilities_current.path,
  "Capability source endpoint drifted from discovery"
);

assert(
  propagation.reverify.authoritative_endpoints.discovery === discovery.endpoints.discovery.path,
  "Reverify discovery endpoint drift"
);
assert(
  propagation.reverify.authoritative_endpoints.capabilities_current === discovery.endpoints.capabilities_current.path,
  "Reverify capabilities endpoint drift"
);
assert(
  propagation.reverify.authoritative_endpoints.fit_criteria === discovery.endpoints.fit_criteria.path,
  "Reverify fit criteria endpoint drift"
);
assert(
  propagation.reverify.authoritative_endpoints.install === discovery.endpoints.install.path,
  "Reverify install endpoint drift"
);

assert(
  propagation.reverify.authoritative_endpoints.discovery === MACHINE_ENDPOINTS.discovery,
  "Reverify discovery endpoint mismatch with endpoint map"
);
