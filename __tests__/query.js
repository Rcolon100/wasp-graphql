var query = require('../src/query');

describe('query.js', function() {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ data: 42 }));
  });

  it('returns a promise on error', function() {
    return query().catch(e => expect(e).toBeTruthy());
  });

  it('rejects if the first argument is invalid', function() {
    return query('').catch(e => expect(e).toBeTruthy());
  });

  it('rejects if the second argument is invalid', function() {
    return query('/foo', 'init').catch(e => expect(e).toBeTruthy());
  });

  it('succeeds when receiving a "fields" prop', function() {
    return query('/foo', { fields: 'bar' }).then(res =>
      expect(res).toBeTruthy()
    );
  });

  it('succeeds when receiving a "body" prop', function() {
    return query('/foo', { body: 'bar' }).then(res => expect(res).toBeTruthy());
  });

  it('can call an endpoint and return data', function() {
    return query('/foo', { fields: 'bar' })
      .then(res => res.json())
      .then(json => expect(json.data).toBe(42));
  });

  it('allows currying a url for later use', function() {
    var loadedQuery = query('/foo');

    expect(typeof loadedQuery).toBe('function');
    return loadedQuery({ fields: 'bar' })
      .then(res => res.json())
      .then(json => expect(json.data).toBe(42));
  });

  it('rejects a curried function on receiving a new but invalid argument', function() {
    var loadedQuery = query('/foo');

    return loadedQuery('bar').catch(e => expect(e).toBeTruthy());
  });
});
