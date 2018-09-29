// A mock gateway for testing web3c methods.
// Uses a fixed key for operations.
const http = require('http');
const web3 = require('web3');
const buffer = require('buffer');
const nacl = require('tweetnacl');

const onReq = function (req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    let jsonreq = JSON.parse(body);
    res.writeHead(200, {
        'Content-Type': 'text/json',
		'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(handleRequest(jsonreq)));
  });
};

function handleRequest (req) {
  let obj = {
    'jsonrpc': '2.0',
    'id': req.id,
  };
  // Arbitrarily chosen.
  let key = new Uint8Array(Buffer.from(
    '263357bd55c11524811cccf8c9303e3298dd71abeb1b20f3ea7db07655dba9e9', 'hex'));
  // associated pubkey: 0x59e35409ffdb0be6a74acc88d5e99e2b50782662fa5bf834b8b9d53bc59c7c4a

  if(req.method == 'confidential_getPublicKey') {
    obj.result = {
      'key': '0x59e35409ffdb0be6a74acc88d5e99e2b50782662fa5bf834b8b9d53bc59c7c4a',
      'timestamp': web3.utils.toHex((new Date()).valueOf()),
      'signature': 0,
    };
  } else if (req.method == 'eth_call') {
    obj.result = '0x000000000000000000000000000000000000000000000000000000000000000a';
  }
  return obj;
}

module.exports = function () {
  return http.createServer(onReq);
};
