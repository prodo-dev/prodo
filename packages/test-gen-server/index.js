#!/usr/bin/env node

var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var path = require("path");
var prettier = require("prettier");
var configPath = path.join(process.cwd(), process.argv[2]);
console.log(`Using config from ${configPath}`);
var config = require(configPath);
console.log({ config });

app.use(cors());
app.use(express.json());

const PORT = config.port;

const format = code => {
  try {
    return prettier.format(code, { semi: true, parser: "typescript" });
  } catch (e) {
    return code;
  }
};

Object.keys(config.generators).forEach(funcName => {
  const { dir, template } = config.generators[funcName];
  app.post("/" + funcName, function(req, res, next) {
    const input = req.body;
    const testFileName = path.join(
      process.cwd(),
      dir,
      input.name
        .replace(/ /g, "")
        .replace(/[^a-z0-9]/gi, "")
        .toLowerCase() + ".test.tsx",
    );
    if (fs.existsSync(testFileName)) {
      res.json({ error: "FILE_ALREADY_EXISTS", testFileName });
    } else {
      try {
        fs.writeFileSync(testFileName, format(template(enrich(input))));
        res.json({ success: true, testFileName });
      } catch (e) {
        res.json({ error: e.message, testFileName });
      }
    }
  });
});

function enrich(input) {
  const { name, universe, actionLog } = input;
  const str = x => JSON.stringify(x);
  input.testName = str(name);
  input.state = str(universe.state);
  if (actionLog && actionLog.length) {
    input.actionNames = Array.from(
      new Set(actionLog.map(x => x.actionName)),
    ).join(",");
    input.firstState = str(actionLog[0].prevUniverse.state);
    input.lastState = str(actionLog[actionLog.length - 1].nextUniverse.state);
    let mocks = {};
    actionLog.forEach(action => {
      if (action.recordedEffects) {
        action.recordedEffects.forEach(({ name, value }) => {
          if (!mocks[name]) mocks[name] = [];
          mocks[name].push(value);
        });
      }
    });
    input.recordedEffects = str(mocks);
    input.awaitActions = actionLog
      .map(
        action => `
          await store.dispatch(${action.actionName})(${action.args
          .map(str)
          .join(",")})`,
      )
      .join(";");
  }
  return input;
}

app.listen(PORT, function() {
  console.log(`Test gen server listening on port ${PORT}`);
});
