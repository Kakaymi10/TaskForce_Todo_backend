import assert from 'assert';
import request from 'supertest';
import app from './index.js'; // Assuming your Express app is in index.js
import usersRoutes from './routes/todos.js'; // Adjust the path as needed

// Configure Mocha to use 'describe' and 'it' blocks for testing
describe('Todo API', () => {
  // Test cases go here

  // For example, you can test the GET /todos endpoint
  it('should retrieve all Todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200) // Expecting a successful response with HTTP status 200
      .end((err, res) => {
        if (err) return done(err);
        
        // Add your assertions here to check the response body, headers, etc.
        assert(Array.isArray(res.body)); // Assuming it should return an array
        done();
      });
  });


  it('should create a new Todo and increment the length of the response body by 1', (done) => {
    const newTodo = {
      todo_name: 'Test Todo',
      description: 'This is a test Todo.',
    };
  
    // Get the length of the response body before creating a new Todo
    let initialResponseBodyLength;
  
    request(app)
      .get('/todos') // Assuming this route returns the list of Todos
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
  
        initialResponseBodyLength = res.body.length;
  
        // Create a new Todo
        request(app)
          .post('/todos')
          .send(newTodo)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
  
            // Get the length of the response body after creating a new Todo
            request(app)
              .get('/todos') // Assuming this route returns the updated list of Todos
              .expect(200)
              .end((err, res) => {
                if (err) return done(err);
  
                // Ensure that the length has increased by 1, indicating the new Todo was appended
                const updatedResponseBodyLength = initialResponseBodyLength + 1;
                assert.strictEqual(res.body.length, updatedResponseBodyLength);
  
                done(); // Complete the test
              });
          });
      });
  });
  
 
  // Add more test cases for other endpoints here
});
