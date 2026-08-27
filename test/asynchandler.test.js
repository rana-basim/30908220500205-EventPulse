const asynchandler = require('../utils/asynchandler');

describe('asynchandler utility unit tests', () => {
  test('should execute wrapped function successfully and pass control', async () => {
    const mockfn = jest.fn().mockResolvedValue('success');
    const req = {};
    const res = {};
    const next = jest.fn();

    const wrappedfn = asynchandler(mockfn);
    await wrappedfn(req, res, next);

    expect(mockfn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test('should catch errors and pass them to next middleware', async () => {
    const mockerror = new Error('async error occurred');
    const mockfn = jest.fn().mockRejectedValue(mockerror);
    const req = {};
    const res = {};
    const next = jest.fn();

    const wrappedfn = asynchandler(mockfn);
    await wrappedfn(req, res, next);

    expect(mockfn).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(mockerror);
  });
});