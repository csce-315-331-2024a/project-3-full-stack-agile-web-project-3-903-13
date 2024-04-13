const { startServer } = require('../index');
const request = require('supertest');

describe('Server startup and export', () => {
  let server;

  beforeAll(() => {
    server = startServer();
  });

  afterAll(done => {
    server.close(done);
  });

  test('Start the server and check if it is listening', done => {
    // Check if the server is listening on the expected port
    const isListening = server.listening;
    expect(isListening).toBe(true);
    done();
  });
});
