'use strict';
const AWS = require('aws-sdk');
const Router = require('koa-router');
const uuid4 = require('uuid4');
const { spawn, Thread, Worker } = require('threads');

const config = require('../../config');

const router = new Router();

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  accessKeyId: config.awsAccessKey,
  secretAccessKey: config.awsSecretAccessKey,
  useAccelerateEndpoint: true,
  region: config.awsRegion,
});

router
  .post('/create-url', async ctx => {
    const key = uuid4();

    const params = {
      Bucket: config.s3BucketName,
      Key: key,
      Expires: config.signedUrlExpireSeconds,
      ACL: 'bucket-owner-full-control',
      ContentType: ctx.request.body.type,
    };

    try {
      const url = await s3.getSignedUrl('putObject', params);
      ctx.body = {
        success: true,
        message: 'AWS SDK S3 Pre-signed urls generated successfully',
        url,
        key,
      };
    } catch {
      ctx.status = 500;
      ctx.body = { success: false, message: 'Pre-Signed URL error' };
    }
  })
  .get('/process-file', async ctx => {
    try {
      const processFile = await spawn(new Worker('./processFile'));

      await processFile(ctx.query.key).forEach(data => {
        ctx.sse.send(JSON.stringify(data));
      });
      await Thread.terminate(processFile);
      ctx.status = 200;
    } catch {
      ctx.status = 500;
    } finally {
      ctx.sse.sendEnd();
    }
  });

module.exports = router;
