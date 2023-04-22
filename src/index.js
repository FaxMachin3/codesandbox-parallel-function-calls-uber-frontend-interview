// Inputs
// inputs: An array of inputs.
// limit: The maximum number of operations at any one time.
// iterateeFn: The async function that should be called with each input to generate the corresponding output. It will have two arguments:
//      input: The input being processed.
//      callback: A function that will be called when the input is finished processing. It will be provided one argument, the processed output.
// callback: A function that should be called with the array of outputs once all the inputs have been processed.

function getNameById(id, callback) {
  // simulating async request
  const randomRequestTime = Math.floor(Math.random() * 100) + 200;

  setTimeout(() => {
    callback("User" + id);
  }, randomRequestTime);
}

function mapLimitInOrder(inputs, limit, iterateeFn, callback) {
  let outputs = [];
  let i = 0;

  async function execute() {
    while (i < inputs.length) {
      const prmArr = [];
      const end = i + limit < inputs.length ? i + limit : inputs.length;

      for (; i < end; i++) {
        prmArr.push(new Promise((cb) => iterateeFn(inputs[i], cb)));
      }

      outputs.push(...(await Promise.all(prmArr)));
    }
  }

  execute().then((res) => callback(outputs));
}

function mapLimit(inputs, limit, iterateeFn, callback) {
  let outputs = [];
  let i = 0;

  function execute() {
    return new Promise((exeRes) => {
      while (i < inputs.length) {
        const prmArr = [];
        const end = i + limit < inputs.length ? i + limit : inputs.length;

        for (; i < end; i++) {
          prmArr.push(new Promise((cb) => iterateeFn(inputs[i], cb)));
        }

        Promise.all(prmArr).then((res) => {
          outputs = [...outputs, ...res];
          if (outputs.length === inputs.length) exeRes(outputs);
        });
      }
    });
  }

  execute().then((res) => callback(res));
}

mapLimit([1, 2, 3, 4, 5], 2, getNameById, (allResults) => {
  console.log("output:", allResults); // ["User1", "User2", "User3", "User4", "User5"]
});
