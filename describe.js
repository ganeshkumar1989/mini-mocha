const success = desc => console.log(`${desc} : Pass`);
const failure = (desc, msg) => console.log(`:( ${desc} : Fail => ${msg}`);
const log = desc => console.log(desc);

const syncToAsync = (fn) => {
	return new Promise((resolve, reject) => {
		fn();
		resolve();
	});
};

const activity = {};
const stack = [];
const isEmptyStack = () => stack.length === 0;
const stackTop = () => stack[stack.length - 1];
const ctx = {};

const timeoutPromise = function(timeout, promise){
  let timeoutPromiseObj = new Promise((resolve, reject) => {
    let timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      reject(new Error('Timed out in '+ timeout + 'ms, since the done method was not called.'))
    }, timeout);
  });

  return Promise.race([
    promise,
    timeoutPromiseObj
  ]);
}

const spush = (key, val) => stackTop()[key].push(val);

const indentedTitle = (ctxt, level) =>
  `${Array.apply(null, {length: level}).reduce((s) => s+='   ', '')}${ctxt}`;

const newTop = title =>
  ({ title, tests: [], setup: [], teardown: [], testSuites: [] });

const execTop = () => {
	var testCasePromiseChain = Promise.resolve();
	'setup tests testSuites teardown'.split(' ')
		.forEach(key => stackTop()[key].forEach((dat) => {
			testCasePromiseChain = testCasePromiseChain.then(activity[key].bind(null, dat, stack.length));
		}));
	testCasePromiseChain = testCasePromiseChain.then(() => stack.pop());
	return testCasePromiseChain;
}

const execTestSuite = (title, testSuiteFn, level) => {
  log(indentedTitle(title, level));
  stack.push(newTop(title));  
  testSuiteFn.call(ctx);   // collect testSuites, setup, teardown and it.
  return execTop();               // execute them
};

const reportTests = (fn, title, level) => {
  const desc = indentedTitle(title, level);
  if(fn.length>0){
	  // fn accepts the done callback
	  
	  let testPromise = new Promise((resolve, reject) => {
		fn.call(ctx, (err) => {
			if(!err){
				resolve();
			}
			else{
				reject(err);
			}
		});
	  });
	  
	  return timeoutPromise(settings.timeout, testPromise)
	  .then(() => {
		  success(desc);
	  }, (err) => {
		  failure(desc, err.message);
	  });
  }
  else{
	  return new Promise((resolve, reject) => {
		  try {
			fn.call(ctx);
			success(desc);
		  } catch (e) {
			failure(desc, e.message);
		  }
		  resolve();
	  });
  }  
};

activity.setup = (fn, level) => syncToAsync(fn.bind(ctx));
activity.teardown = (fn, level) => syncToAsync(fn.bind(ctx));
activity.testSuites = ([title, testFn], level) =>
	execTestSuite(title, testFn, level);
activity.tests = ([title, testFn], level) =>
	reportTests(testFn, title, level);

export const test = (desc, fn) => spush('tests', [desc, fn]);
export const testSuite = (title, testfn) => {
  if (isEmptyStack()) {
    execTestSuite(title, testfn, 0);
    return;
  }
  spush('testSuites', [title, testfn]);
};
export const setup = spush.bind(null, 'setup');
export const teardown = spush.bind(null, 'teardown');
export const settings = {timeout: 5000}; // in ms