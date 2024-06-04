const fs = require("fs");

const resource = process.argv[process.argv.length - 1];

const overwrite = process.argv.findIndex((x) => x === "-o") >= 0;

console.log(`Converting file ${resource}...`);
const account = require(resource);

const mergeObjects = (obj1, obj2) => {
  const map = { ...obj1 };
  const k2 = Object.keys(obj2);
  for (let i = 0; i < k2.length; i++) {
    const tempKey = k2[i];
    if (obj1[tempKey] === null || obj1[tempKey] === undefined) {
      map[tempKey] =
        typeof obj2[tempKey] === "string"
          ? obj2[tempKey]
          : { ...obj2[tempKey] };
    } else {
      map[tempKey] = mergeObjects(obj1[tempKey], obj2[tempKey], i + 1);
    }
  }

  return map;
};

const newMap = Object.keys(account).reduce((map, key) => {
  const val = account[key];
  const keys = key.split(".");
  let newObj = {};
  for (let i = keys.length - 1; i >= 0; i--) {
    if (i === keys.length - 1) {
      newObj[keys[i]] = val;
    } else {
      newObj = { [keys[i]]: { ...newObj } };
    }
  }
  return mergeObjects(map, newObj, 0);
}, {});

//console.log("newMap: ", newMap);

const arr = resource.split(".");
const newFileName = overwrite
  ? resource
  : [".", ...arr.slice(0, arr.length - 1), "_new"].join("") + ".json";
console.log("Writing JSON to", newFileName);

fs.writeFileSync(newFileName, JSON.stringify(newMap, null, 2));

console.log("File write successful.\n");
