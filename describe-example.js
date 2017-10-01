import assert from 'assert';
import { test, testSuite, setup, teardown, settings } from './describe';

const obj = {};
settings.timeout = 3000;

testSuite('True Or False? ', () => {
  testSuite('setup', () => {
	// Asynchronous pass case
    test('should setup num', (done) => {
      setTimeout(() => {
		  try{
			  assert.equal(obj.num, 2);
			  done();
		  }
		  catch(e){
			  done(e);
		  }
	  }, 1000);
    });
    setup(() => {
      obj.num = 2;
    });
    teardown(() => {
      obj.num = null;
    });
  });

  testSuite('teardown', () => {
	// Asynchronous timeout case (call takes more time that timeout)
    test('should teardown num', (done) => {
	  setTimeout(() => {
		  try{
			assert.equal(obj.num, null);
			done();
		  }
		  catch(e){
			done(e);
		  }
	  }, 5000);      
    });
  });

  testSuite('truthy => ', () => {	
    // done not called at all - causes timeout
    test('empty array', (done) => {	  
      assert.equal(!![0], true);
    });

    test('empty object', () => {
      assert.equal(!!{}, true);
    });
  });

  testSuite('falsy => ', () => {
    testSuite('undefined & nil', () => {
      test('undefined', () => {
        assert.equal(!(void 0), true);
      });
      test('null', () => {
        assert.equal(!null, true);
      });
    });
	
	// Asynchronous failure case
    test('should test ![] === true ', (done) => {
	  setTimeout(function(){
		 try {
			 assert.equal(![], true);
			 done();
		 }
		 catch(e){
			 done(e)
		 }
	  }, 2000);      
    });

    test('!NaN === true', () => {
      assert.equal(!NaN, true);
    });
    test('!(empty string) === true', () => {
      assert.equal(!'', true);
    });
  });
});
