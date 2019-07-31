import axios from 'axios';

import file from './modules/file';

class Client {
  req = null;

  sse = null;

  // modules
  file = null;

  constructor(baseURL = '') {
    this.req = axios.create({
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      baseURL,
    });

    this.file = file(this.req);
  }
}

let instance;
export default function api(baseUrl) {
  if (!instance) {
    instance = new Client(baseUrl);
  }

  return instance;
}
