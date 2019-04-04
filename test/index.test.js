const fs = require('fs');
const test = require('ava');
const sinon = require('sinon');
const UploadProvider = require('..');

const config = {
  uploads_dir: 'test',
};

test('constructor(config): does not error', (t) => {
  t.notThrows(() => new UploadProvider(config));
});

test('constructor(config): throws an error when missing config upload directory', (t) => {
  t.throws(() => new UploadProvider());
});

test('readFile(filePath): returns null when unable to read file', (t) => {
  // const stub = sinon.stub(fs, 'readFileSync'); // BUG: https://github.com/avajs/ava/issues/1359
  const s = new UploadProvider(config);
  const result = s.readFile('missing.json');
  t.is(result, null);
});

test('deleteFile(filePath): removes the file from disk', (t) => {
  const spy = sinon.spy(fs, 'unlinkSync'); // BUG: https://github.com/avajs/ava/issues/1359
  const s = new UploadProvider(config);

  s.deleteFile('example-upload.pdf');

  t.true(spy.calledOnce);
  t.true(spy.calledWith('test/example-upload.pdf'));

  fs.unlinkSync.restore();
});

test('all(): returns all the files', (t) => {
  const stub = sinon.stub(fs, 'readdirSync'); // BUG: https://github.com/avajs/ava/issues/1359
  stub.returns([
    '.DS_Store',
    'example-upload.pdf',
  ]);
  const s = new UploadProvider(config);
  const results = s.all();

  t.true(stub.calledOnce);
  t.true(stub.calledWith('test'));
  t.true(Array.isArray(results));

  fs.readdirSync.restore();
});

test('storeFile(req, res, callback): calls uploadImageHandler', (t) => {
  const s = new UploadProvider(config);
  const spy = sinon.spy();
  s.uploadImageHandler = spy;
  s.storeFile(1, 2, 3);

  t.true(spy.calledOnce);
  t.true(spy.calledWith(1, 2, 3));
});
