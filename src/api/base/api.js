class API {
  request = null;

  url = '';

  constructor(request, url) {
    this.request = request;
    this.url = url;
  }

  r(config) {
    return this.request({
      ...config,
      url: `${this.url}${config.url || ''}`,
    });
  }
}

export default API;
