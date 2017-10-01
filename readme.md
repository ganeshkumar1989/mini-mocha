http://mochajs.org/ is a testing framework in JavaScript. This is a  minimal implementation of asynchronous mocha api. Clone the repository and then run `npm install` to setup install dependencies. Run `npm start` to test the current implementation. It should produce output similar to ‘output.txt’. The code supports asynchronous tests, in which case, the `done` callback has to be passed into the test case and called once all tests are complete. 

In code terms, current implementation allows for synchronous tests written as:
```javascript
    test('should test ![] === true ', () => {
      assert.equal(![], true);
    });
```

It also has asynchronous tests capabilites, written as below:
```javascript
    test('should test ![] === true ', (done) => {
      setTimeout(() => {
        try {
          assert.equal(![], true);
          done(); // success case
        } catch (err) {
          done(err); // error case
        }
      }, 2000);
    });
```

The timeout can be set using the following code:
```javascript
    settings.timeout = 5000;
```