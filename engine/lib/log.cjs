'use strict';
// One place that decides what a run looks like on the terminal and what it keeps
// on disk. The terminal gets short, aligned, timestamped lines; the detail (every
// wave, every case, every stage record) goes to a JSONL file so nothing is lost
// and nothing floods the console.
const fs = require('node:fs');

const pad = value => String(value).padStart(6);
const secs = ms => pad((ms / 1000).toFixed(1)) + 's';

function createLogger({file = null, quiet = false} = {}) {
  const started = Date.now();
  let detailFd = null;
  if (file) detailFd = fs.openSync(file, 'a');

  const write = line => { if (!quiet) process.stdout.write(line + '\n'); };

  return {
    // Detail: JSONL on disk, silent on the terminal.
    detail(record) {
      if (detailFd !== null) fs.writeSync(detailFd, JSON.stringify(record) + '\n');
    },
    // Progress: one short line the operator can follow.
    step(text, status = '') {
      write(`[${secs(Date.now() - started)}] ${text}${status ? '  ' + status : ''}`);
    },
    // A stage's end, with its own duration.
    done(name, ms, status = 'ok') {
      write(`[${secs(Date.now() - started)}] ${name}  ${status} in ${secs(ms)}`);
    },
    summary(fields) {
      const width = Math.max(...Object.keys(fields).map(k => k.length));
      write('');
      for (const [key, value] of Object.entries(fields))
        write(`  ${key.padEnd(width)}  ${value}`);
      write('');
    },
    close() {
      if (detailFd !== null) { fs.closeSync(detailFd); detailFd = null; }
    },
    file,
    elapsed: () => Date.now() - started,
  };
}

// What belongs on the operator's terminal: our own progress/summary lines and any
// plain sentence the pipeline prints. Structured control records start with '{' and
// are consumed by the engine, so they stay out of the way.
const isUserFacing = line => Boolean(line.trim()) && !line.startsWith('{');

module.exports = {createLogger, isUserFacing};
