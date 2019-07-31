'use strict';
const AWS = require('aws-sdk');
const { expose } = require('threads/worker');
const Observable = require('zen-observable');
const XLSX = require('xlsx');
const _ = require('lodash');

const config = require('../../config');

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  accessKeyId: config.awsAccessKey,
  secretAccessKey: config.awsSecretAccessKey,
  useAccelerateEndpoint: true,
  region: config.awsRegion,
});

const event = (value, done = false) => ({ value, done });

expose(function processFile(key) {
  return new Observable(async observer => {
    observer.next(event('retrieving'));
    const s3Object = await s3
      .getObject({
        Bucket: config.s3BucketName,
        Key: key,
      })
      .promise();

    observer.next(event('parsing'));
    const workbook = XLSX.read(s3Object.Body);
    const sheet = workbook.SheetNames[0];

    const currentYear = new Date().getFullYear();

    observer.next(event('processing'));
    const data = _(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
      .filter(x => XLSX.SSF.parse_date_code(x.date).y === currentYear)
      .map(entry => ({ name: entry.Name, points: entry.Points }));

    observer.next(event(data.toJSON(), true));

    observer.complete();
  });
});
