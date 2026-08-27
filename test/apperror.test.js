const apperror = require('../utils/apperror');

describe('apperror utility unit tests', () => {
  test('should format 4xx status codes as "fail"', () => {
    const err = new apperror('resource not found', 404);

    expect(err.message).toBe('resource not found');
    expect(err.statusCode).toBe(404);
    expect(err.status).toBe('fail');
    expect(err.isOperational).toBe(true);
  });

  test('should format 5xx status codes as "error"', () => {
    const err = new apperror('internal server error', 500);

    expect(err.statusCode).toBe(500);
    expect(err.status).toBe('error');
    expect(err.isOperational).toBe(true);
  });
});