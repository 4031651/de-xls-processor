import axios from 'axios';
import Observable from 'zen-observable';
import API from '../base/api';

class FileApi extends API {
  async createUrl(type) {
    return this.r({
      method: 'POST',
      url: '/create-url',
      data: { type },
    });
  }

  uploadFile = async (url, file) =>
    axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

  processFile(key) {
    const uri = this.request.getUri({
      url: `${this.url}/process-file`,
      params: {
        sse: true,
        key,
      },
    });
    const url = `${this.request.defaults.baseURL}${uri}`;

    return new Observable(observer => {
      const evtSource = new EventSource(url);
      evtSource.onmessage = e => {
        const data = JSON.parse(e.data);

        observer.next(data);
        if (data.done) {
          observer.complete();
        }
      };
    });
  }
}

export default function fileApi(request) {
  return new FileApi(request, '/file');
}
