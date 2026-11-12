# Archived analysis scripts

These produced the Civ7 offset tables in `../../targets/civ7/` and the reports in
`../../docs/reports/`. They are kept for provenance and for re-deriving offsets
after a game build change — they are **not** part of running the port.

They reference the original analysis workspace layout (`port/`, a `dump/` tree of
the Civ7 `nnSdk` module, generated scratch files such as `xref-index.json`), so
expect to adjust input paths before reusing one. None of them is called by the
engine, `engine/run.cjs` or the tests.

Operational tools (loader compatibility, artifact validation/regeneration) stay
in the parent directory.
