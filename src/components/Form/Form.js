import api from '../../api';

const ALLOWED_TYPES = ['.xls', '.xlsx'];

function checkFileType(file) {
  if (!file || !file.name) {
    return false;
  }
  const ext = file.name.substring(file.name.lastIndexOf('.'));
  if (!ALLOWED_TYPES.includes(ext)) {
    return `Invalid file selected, valid files are of ${ALLOWED_TYPES.join(', ')} types.`;
  }

  return true;
}

export default {
  name: 'Form',
  data: () => ({
    checkFile: [file => (file && !!file.name) || 'File is required', checkFileType],
    file: null,
    step: null,
    resultHeaders: [{ text: 'Name', value: 'name' }, { text: 'Points', value: 'points' }],
    result: null,
  }),
  methods: {
    showError(message) {
      this.$toasted.error(message, {
        icon: 'error-outline',
      });
    },
    clear() {
      this.result = null;
    },
    async handleSubmit(evt) {
      evt.preventDefault();
      if (!this.$refs.form.validate()) {
        return;
      }

      let url = '';
      let key = '';
      this.step = 'preparing';

      try {
        const urlResp = await api().file.createUrl(this.file.type);
        if (!urlResp.data.success) {
          throw new Error(urlResp.data.message);
        }

        ({ url, key } = urlResp.data);
      } catch {
        this.showError('Cannot generate AWS signed url');
        return;
      }

      try {
        await api().file.uploadFile(url, this.file);
      } catch {
        this.showError('Cannot upload file to AWS');
        return;
      }

      try {
        await api()
          .file.processFile(key)
          .forEach(({ done, value }) => {
            if (done) {
              this.result = value;
              this.step = null;
            } else {
              this.step = value;
            }
          });
      } catch {
        this.showError('Error file processing');
      }
    },
  },
};
