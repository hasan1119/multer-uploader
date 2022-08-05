# Multer-Uploader [![Build Status](https://i.ibb.co/fksfzN7/Dakirby309-Simply-Styled-You-Tube-1.png)](https://www.youtube.com/c/codingclubbangladesh?sub_confirmation=1)

Multer-Uploader is a node.js middleware for handling `multipart/form-data`, which is primarily used for uploading files. It is written
on top of [multer](https://www.npmjs.com/package/multer) for maximum efficiency.

**NOTE**: Multer-Uploader will not process any form which is not multipart (`multipart/form-data`).

## Installation

```sh
$ npm install --save multer-uploader
```

## Usage

Multer-Uploader adds a `body` object and a `file` or `files` object to the `request` object. The `body` object contains the values of the text fields of the form, the `file` or `files` object contains the files uploaded via the form.

Basic usage example:

Don't forget the `enctype="multipart/form-data"` in your form.

```html
<form action="/profile" method="post" enctype="multipart/form-data">
  <input type="file" name="avatar" />
</form>
```

```javascript
const express = require("express");
const upload = require("multer-uploader");

const app = express();

// absolute path of your upload directory
const upload_dir = path.join(__dirname, "/public/uploads"); // absolute path
// max file size in bytes, such as 1MB equal 1000000 bytes
const max_file_size = 1000000; // bytes
// allowed file types in Array
const allowed_file_mime_type = ["image/png", "image/jpg", "image/jpeg"]; // mime types Array

app.post(
  "/profile",
  upload(upload_dir, max_file_size, allowed_file_mime_type).single("avatar"),
  function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
  }
);

app.post(
  "/photos/upload",
  upload(upload_dir, max_file_size, allowed_file_mime_type).array("photos", 2),
  function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  }
);

const cpUpload = upload(
  upload_dir,
  max_file_size,
  allowed_file_mime_type
).fields([
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 8 },
]);
app.post("/cool-profile", cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
});
```

In case you need to handle a text-only multipart form, you should use the `.none()` method:

```javascript
const express = require("express");
const app = express();
const upload = require("multer-uploader");

app.post("/profile", upload().none(), function (req, res, next) {
  // req.body contains the text fields
});
```

Here's an example on how multer-uploader is used an HTML form. Take special note of the `enctype="multipart/form-data"` and `name="uploaded_file"` fields:

```html
<form action="/stats" enctype="multipart/form-data" method="post">
  <div class="form-group">
    <input type="file" class="form-control-file" name="uploaded_file" />
    <input
      type="text"
      class="form-control"
      placeholder="Number of speakers"
      name="nspeakers"
    />
    <input type="submit" value="Get me the stats!" class="btn btn-default" />
  </div>
</form>
```

Then in your javascript file you would add these lines to access both the file and the body. It is important that you use the `name` field value from the form in your upload function. This tells multer which field on the request it should look for the files in. If these fields aren't the same in the HTML form and on your server, your upload will fail:

```javascript
const upload = require("multer-uploader");

// absolute path of your upload directory
const upload_dir = path.join(__dirname, "/public/uploads"); // absolute path
// max file size in bytes, such as 1MB equal 1000000 bytes
const max_file_size = 1000000; // bytes
// allowed file types in Array
const allowed_file_mime_type = ["image/png", "image/jpg", "image/jpeg"]; // mime types Array

app.post(
  "/stats",
  upload(upload_dir, max_file_size, allowed_file_mime_type).single(
    "uploaded_file"
  ),
  function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any
    console.log(req.file, req.body);
  }
);
```

## API

### File information

Each file contains the following information:

| Key            | Description                                   |
| -------------- | --------------------------------------------- |
| `fieldname`    | Field name specified in the form              |
| `originalname` | Name of the file on the user's computer       |
| `encoding`     | Encoding type of the file                     |
| `mimetype`     | Mime type of the file                         |
| `size`         | Size of the file in bytes                     |
| `destination`  | The folder to which the file has been saved   |
| `filename`     | The name of the file within the `destination` |
| `path`         | The full path to the uploaded file            |
| `buffer`       | A `Buffer` of the entire file                 |

###

#### `.single(fieldname)`

Accept a single file with the name `fieldname`. The single file will be stored
in `req.file`.

#### `.array(fieldname[, maxCount])`

Accept an array of files, all with the name `fieldname`. Optionally error out if
more than `maxCount` files are uploaded. The array of files will be stored in
`req.files`.

#### `.fields(fields)`

Accept a mix of files, specified by `fields`. An object with arrays of files
will be stored in `req.files`.

`fields` should be an array of objects with `name` and optionally a `maxCount`.
Example:

```javascript
[
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 8 },
];
```

#### `.none()`

Accept only text fields. If any file upload is made, error with code
"LIMIT_UNEXPECTED_FILE" will be issued.

#### `.any()`

Accepts all files that comes over the wire. An array of files will be stored in
`req.files`.

**WARNING:** Make sure that you always handle the files that a user uploads.
Never add multer as a global middleware since a malicious user could upload
files to a route that you didn't anticipate. Only use this function on routes
where you are handling the uploaded files.

## Error handling

When encountering an error, Multer will delegate the error to Express. You can
display a nice error page using [the standard express way](http://expressjs.com/guide/error-handling.html).

If you want to catch errors specifically from Multer, you can call the
middleware function by yourself. Also, if you want to catch only [the Multer errors](https://github.com/expressjs/multer/blob/master/lib/multer-error.js), you can use the `MulterError` class that is attached to the `multer` object itself (e.g. `err instanceof multer.MulterError`).

```javascript
const upload = require("multer-uploader");
const uploader = upload.single("avatar");

app.post("/profile", function (req, res) {
  uploader(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
    }

    // Everything went fine.
  });
});
```

## License

[MIT](LICENSE)
