const fs = require('fs');
const test = require('ava');
const sinon = require('sinon');
const UploadProvider = require('../index');

test('Upload Provider: constructor(config): does not error', (t) => {
  t.notThrows(() => new UploadProvider());
});

test('Upload Provider: readFile(filePath): returns null when unable to read file', (t) => {
  // const stub = sinon.stub(fs, 'readFileSync'); // BUG: https://github.com/avajs/ava/issues/1359
  const s = new UploadProvider();
  const result = s.readFile('missing.json');
  t.is(result, null);
});

test('Upload Provider: deleteFile(filePath): removes the file from disk', (t) => {
  const spy = sinon.spy(fs, 'unlinkSync'); // BUG: https://github.com/avajs/ava/issues/1359
  const s = new UploadProvider({ uploads_dir: 'test' });

  s.deleteFile('example-upload.pdf');

  t.true(spy.calledOnce);
  t.true(spy.calledWith('test/example-upload.pdf'));

  fs.unlinkSync.restore();
});

test('Upload Provider: all(): returns all the files', (t) => {
  const stub = sinon.stub(fs, 'readdirSync'); // BUG: https://github.com/avajs/ava/issues/1359
  stub.returns([
    '.DS_Store',
    'example-upload.pdf',
  ]);
  const s = new UploadProvider({ uploads_dir: 'test' });
  const results = s.all();

  t.true(stub.calledOnce);
  t.true(stub.calledWith('test'));
  t.true(Array.isArray(results));

  fs.readdirSync.restore();
});

test('Upload Provider: storeFile(req, res, callback): calls uploadImageHandler', (t) => {
  const s = new UploadProvider();
  const spy = sinon.spy();
  s.uploadImageHandler = spy;
  s.storeFile(1, 2, 3);

  t.true(spy.calledOnce);
  t.true(spy.calledWith(1, 2, 3));
});
