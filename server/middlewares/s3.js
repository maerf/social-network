const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets"); // in dev they are in secrets.json which is listed in .gitignore, hopefully ...
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    // if there is no file -> send error message.
    if (!req.file) {
        console.log("uploader req.file falsy", req.file);
        return res.sendStatus(500);
    }

    // we only want to talk to s3 IF we have a file!
    // console.log("file: ", req.file);
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "magicplace",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            console.log("aws upload worked!");
            fs.unlink(path, () => {});
            next();
        })
        .catch((err) => {
            // uh oh
            console.log("err in s3 upload: ", err);
            res.sendStatus(404);
        });
};
